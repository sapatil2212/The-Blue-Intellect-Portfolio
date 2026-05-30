"use server";

import { db } from "@/lib/db";
import { getCurrentUserAction } from "./auth";
import { revalidatePath } from "next/cache";

export async function getInvoicesAction() {
  try {
    const invoices = await db.invoice.findMany({
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        project: {
          select: {
            title: true,
          },
        },
        payments: {
          include: {
            verifiedBy: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        invoiceDate: "desc",
      },
    });
    return { success: true, invoices };
  } catch (error: any) {
    console.error("getInvoicesAction error:", error);
    return { success: false, error: error.message || "Failed to fetch invoices" };
  }
}

export async function createInvoiceAction(data: {
  clientId: string;
  projectId?: string;
  amount: number;
  taxAmount?: number;
  commissionAmount?: number;
  discount?: number;
  dueDate: string;
  notes?: string;
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const invCount = await db.invoice.count();
    const invoiceNumber = `INV-2026-${String(invCount + 1).padStart(4, "0")}`;

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        clientId: data.clientId,
        projectId: data.projectId || null,
        amount: Number(data.amount) || 0.0,
        taxAmount: Number(data.taxAmount) || 0.0,
        commissionAmount: Number(data.commissionAmount) || 0.0,
        discount: Number(data.discount) || 0.0,
        dueDate: new Date(data.dueDate),
        notes: data.notes || null,
        status: "PENDING",
      },
    });

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (dbUser) {
      await db.activityLog.create({
        data: {
          userId: dbUser.id,
          action: "CREATE_INVOICE",
          details: `Generated invoice ${invoiceNumber} for client ID ${data.clientId}`,
        },
      });
    }

    revalidatePath("/admin/finance");
    return { success: true, invoice };
  } catch (error: any) {
    console.error("createInvoiceAction error:", error);
    return { success: false, error: error.message || "Failed to create invoice" };
  }
}

export async function recordPaymentAction(data: {
  invoiceId: string;
  amountPaid: number;
  paymentMethod: string;
  referenceNumber?: string;
  screenshotUrl?: string;
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    const invoice = await db.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { payments: true },
    });

    if (!invoice) return { success: false, error: "Invoice not found" };

    const payment = await db.payment.create({
      data: {
        invoiceId: data.invoiceId,
        amountPaid: Number(data.amountPaid) || 0.0,
        paymentMethod: data.paymentMethod,
        referenceNumber: data.referenceNumber || null,
        screenshotUrl: data.screenshotUrl || null,
        status: "PENDING", // PENDING approval by accountant or super admin
      },
    });

    // Notify Accountants or Admins
    const administrators = await db.user.findMany({
      where: {
        role: { in: ["Super Admin", "Admin", "Accountant"] },
      },
    });

    for (const admin of administrators) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: "Payment Recorded - Verification Needed",
          content: `A payment of $${data.amountPaid} has been registered for invoice ${invoice.invoiceNumber}. Verify screenshot/reference details.`,
          type: "WARNING",
          priority: "HIGH",
        },
      });
    }

    revalidatePath("/admin/finance");
    return { success: true, payment };
  } catch (error: any) {
    console.error("recordPaymentAction error:", error);
    return { success: false, error: error.message || "Failed to log payment" };
  }
}

export async function approvePaymentAction(paymentId: string, status: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (!dbUser || !["Super Admin", "Admin", "Accountant"].includes(dbUser.role)) {
      return { success: false, error: "Access denied: Accountants and Admins only" };
    }

    const payment = await db.payment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedById: dbUser.id,
      },
      include: {
        invoice: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (status === "APPROVED") {
      // Calculate total approved payments for this invoice
      const invoicePayments = await db.payment.findMany({
        where: {
          invoiceId: payment.invoiceId,
          status: "APPROVED",
        },
      });

      const totalApprovedPaid = invoicePayments.reduce((acc, pay) => acc + pay.amountPaid, 0);
      const totalOwed = payment.invoice.amount + payment.invoice.taxAmount - payment.invoice.discount;

      let invoiceStatus = "PARTIAL";
      if (totalApprovedPaid >= totalOwed) {
        invoiceStatus = "PAID";
      }

      await db.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          status: invoiceStatus,
          paymentMethod: payment.paymentMethod,
        },
      });
    }

    revalidatePath("/admin/finance");
    return { success: true, payment };
  } catch (error: any) {
    console.error("approvePaymentAction error:", error);
    return { success: false, error: error.message || "Failed to update payment status" };
  }
}

export async function getFinanceOverviewAction() {
  try {
    const invoices = await db.invoice.findMany({
      include: { payments: true },
    });

    let totalRevenue = 0;
    let pendingDues = 0;
    let collectedRevenue = 0;

    invoices.forEach((inv) => {
      const owed = inv.amount + inv.taxAmount - inv.discount;
      const approvedPaid = inv.payments
        .filter((p) => p.status === "APPROVED")
        .reduce((sum, p) => sum + p.amountPaid, 0);

      collectedRevenue += approvedPaid;
      
      if (inv.status !== "PAID") {
        pendingDues += Math.max(0, owed - approvedPaid);
      }
      
      totalRevenue += owed;
    });

    // Month-wise analytics
    const monthlyRevenue = {} as Record<string, number>;
    invoices.forEach((inv) => {
      const month = inv.invoiceDate.toLocaleString("default", { month: "short", year: "2-digit" });
      const owed = inv.amount + inv.taxAmount - inv.discount;
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + owed;
    });

    return {
      success: true,
      metrics: {
        totalRevenue,
        collectedRevenue,
        pendingDues,
        monthlyRevenue,
        invoiceCount: invoices.length,
      },
    };
  } catch (error: any) {
    console.error("getFinanceOverviewAction error:", error);
    return { success: false, error: error.message || "Failed to fetch finance overview" };
  }
}
