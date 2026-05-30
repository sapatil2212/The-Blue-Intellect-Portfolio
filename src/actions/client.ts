"use server";

import { db } from "@/lib/db";
import { getCurrentUserAction } from "./auth";
import { revalidatePath } from "next/cache";

export async function submitOnboardingAction(data: {
  companyName: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  servicesInterested?: string;
  estimatedBudget?: string;
  deadline?: string;
  referenceLinks?: string;
  brandDetails?: string;
  socialLinks?: string;
  uploadedDocuments?: Array<{ name: string; url: string; type: string; size?: number }>;
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "You must be logged in to onboard" };

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { client: true },
    });

    if (!dbUser) return { success: false, error: "User profile not found" };

    // Update user name if not set
    if (!dbUser.name && user.name) {
      await db.user.update({
        where: { id: dbUser.id },
        data: { name: user.name },
      });
    }

    let client = dbUser.client;

    if (!client) {
      client = await db.client.create({
        data: {
          userId: dbUser.id,
          companyName: data.companyName,
          phone: data.phone || null,
          whatsapp: data.whatsapp || null,
          website: data.website || null,
          servicesInterested: data.servicesInterested || null,
          estimatedBudget: data.estimatedBudget || null,
          deadline: data.deadline || null,
          referenceLinks: data.referenceLinks || null,
          brandDetails: data.brandDetails || null,
          socialLinks: data.socialLinks || null,
          onboardingStep: 10, // Completed all steps
          verificationStatus: "PENDING",
        },
      });
    } else {
      client = await db.client.update({
        where: { id: client.id },
        data: {
          companyName: data.companyName,
          phone: data.phone || null,
          whatsapp: data.whatsapp || null,
          website: data.website || null,
          servicesInterested: data.servicesInterested || null,
          estimatedBudget: data.estimatedBudget || null,
          deadline: data.deadline || null,
          referenceLinks: data.referenceLinks || null,
          brandDetails: data.brandDetails || null,
          socialLinks: data.socialLinks || null,
          onboardingStep: 10,
          verificationStatus: "PENDING",
        },
      });
    }

    // Save uploaded documents
    if (data.uploadedDocuments && data.uploadedDocuments.length > 0) {
      for (const file of data.uploadedDocuments) {
        await db.document.create({
          data: {
            name: file.name,
            fileUrl: file.url,
            fileType: file.type,
            folder: "Onboarding Docs",
            tag: "Client Onboarding",
            accessLevel: "INTERNAL", // Admins and team only
            ownerId: dbUser.id,
            sizeBytes: file.size || 0,
          },
        });
      }
    }

    // Create CRM lead entry automatically for tracing the sales pipeline!
    const activeLead = await db.lead.create({
      data: {
        clientName: dbUser.name || user.email,
        companyName: data.companyName,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: dbUser.email,
        source: "Onboarding Portal",
        estimatedBudget: parseFloat(data.estimatedBudget || "0") || 0,
        servicesInterested: data.servicesInterested,
        status: "NEW",
        priority: "HIGH",
        notes: `Brand details: ${data.brandDetails || ""}\nSocial links: ${data.socialLinks || ""}`,
      },
    });

    await db.interactionLog.create({
      data: {
        leadId: activeLead.id,
        type: "NOTE",
        content: `Lead generated automatically via client onboarding form submission. Verification: Pending.`,
      },
    });

    // Notify administrators
    const administrators = await db.user.findMany({
      where: {
        role: { in: ["Super Admin", "Admin"] },
      },
    });

    for (const admin of administrators) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: "New Client Onboarded",
          content: `${dbUser.name || dbUser.email} has completed the onboarding form for ${data.companyName}.`,
          type: "SUCCESS",
          priority: "HIGH",
        },
      });
    }

    revalidatePath("/admin/onboarding");
    return { success: true, client };
  } catch (error: any) {
    console.error("submitOnboardingAction error:", error);
    return { success: false, error: error.message || "Failed to submit onboarding details" };
  }
}

export async function getClientPortalDataAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: {
        client: {
          include: {
            projects: {
              include: {
                tasks: {
                  include: {
                    subtasks: true,
                    comments: {
                      include: {
                        user: { select: { name: true, role: true } },
                      },
                    },
                  },
                },
                invoices: {
                  include: { payments: true },
                },
              },
            },
            invoices: {
              include: { payments: true },
            },
          },
        },
      },
    });

    if (!dbUser || !dbUser.client) {
      return { success: false, error: "Client profile not found" };
    }

    // Fetch client documents (ownerId is client's user ID)
    const documents = await db.document.findMany({
      where: { ownerId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return { 
      success: true, 
      client: dbUser.client,
      documents,
      user: {
        name: dbUser.name,
        email: dbUser.email,
        status: dbUser.status,
      }
    };
  } catch (error: any) {
    console.error("getClientPortalDataAction error:", error);
    return { success: false, error: error.message || "Failed to fetch client portal data" };
  }
}

export async function submitTaskFeedbackAction(data: {
  taskId: string;
  isApproved: boolean;
  revisionComment?: string;
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    const task = await db.task.findUnique({
      where: { id: data.taskId },
      include: { project: true },
    });

    if (!task) return { success: false, error: "Task not found" };

    // Update task status based on approval
    const newStatus = data.isApproved ? "COMPLETED" : "REVIEW";
    
    await db.task.update({
      where: { id: data.taskId },
      data: { status: newStatus },
    });

    // Add comment
    const commentText = data.isApproved 
      ? `Task approved by client.` 
      : `Client requested revisions: ${data.revisionComment || ""}`;

    await db.comment.create({
      data: {
        taskId: data.taskId,
        content: commentText,
        userId: dbUser.id,
      },
    });

    // Notify Project Manager or Assignee
    if (task.assignedToId) {
      const employee = await db.employee.findUnique({
        where: { id: task.assignedToId },
        select: { userId: true },
      });
      if (employee) {
        await db.notification.create({
          data: {
            userId: employee.userId,
            title: data.isApproved ? "Task Approved by Client" : "Client Requested Revisions",
            content: `The task "${task.title}" has been ${data.isApproved ? "approved" : "sent back for revisions"}.`,
            type: data.isApproved ? "SUCCESS" : "WARNING",
            priority: "HIGH",
          },
        });
      }
    }

    revalidatePath("/client");
    return { success: true };
  } catch (error: any) {
    console.error("submitTaskFeedbackAction error:", error);
    return { success: false, error: error.message || "Failed to submit revision feedback" };
  }
}

export async function submitProjectSatisfactionAction(projectId: string, rating: number, comment?: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    // Create a notification for project managers/admins regarding satisfaction
    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) return { success: false, error: "Project not found" };

    const admins = await db.user.findMany({
      where: { role: { in: ["Super Admin", "Admin", "Project Manager"] } },
    });

    for (const admin of admins) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: "Client Feedback Received",
          content: `Project "${project.title}" received a rating of ${rating}/5. Notes: ${comment || "No comment."}`,
          type: rating >= 4 ? "SUCCESS" : "WARNING",
          priority: "HIGH",
        },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("submitProjectSatisfactionAction error:", error);
    return { success: false, error: error.message || "Failed to submit project satisfaction rating" };
  }
}

export async function getPendingOnboardingsAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user || !["Super Admin", "Admin", "Sales Executive"].includes(user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const pendingClients = await db.client.findMany({
      where: {
        verificationStatus: "PENDING",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, clients: pendingClients };
  } catch (error: any) {
    console.error("getPendingOnboardingsAction error:", error);
    return { success: false, error: error.message || "Failed to fetch pending onboarding reviews" };
  }
}

export async function approveOnboardingAction(clientId: string, approve: boolean) {
  try {
    const user = await getCurrentUserAction();
    if (!user || !["Super Admin", "Admin", "Sales Executive"].includes(user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "Admin profile not found" };

    const client = await db.client.findUnique({
      where: { id: clientId },
      include: { user: true },
    });

    if (!client) return { success: false, error: "Client record not found" };

    const newStatus = approve ? "APPROVED" : "REJECTED";

    const updatedClient = await db.client.update({
      where: { id: clientId },
      data: {
        verificationStatus: newStatus,
        approvedBy: dbUser.name || dbUser.email,
      },
    });

    // If approved, verify and active their login status
    if (approve) {
      await db.user.update({
        where: { id: client.userId },
        data: { status: "ACTIVE" },
      });

      // Create a default project sprint workspace for the client automatically
      const firstCategory = await db.category.findFirst();
      const defaultCategory = firstCategory ? firstCategory.id : (await db.category.create({
        data: { name: "Agency Services", slug: "agency-services" }
      })).id;

      const projectTitle = `${client.companyName || client.user.name || "New Client"} Campaign`;
      const projectSlug = projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${Math.floor(1000 + Math.random() * 9000)}`;

      await db.project.create({
        data: {
          title: projectTitle,
          slug: projectSlug,
          description: `Strategic project workspace initialized for ${client.companyName || "client"}. Interested services: ${client.servicesInterested || "Creative Agency Campaign"}.`,
          categoryId: defaultCategory,
          projectType: "WEBSITE",
          thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
          clientId: client.id,
          status: "PLANNING",
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days out
          healthScore: 100,
        },
      });

      // Notify the client via app alert
      await db.notification.create({
        data: {
          userId: client.userId,
          title: "Onboarding Approved",
          content: `Welcome to AetherOS! Your onboarding has been verified. Your active project workspace has been created.`,
          type: "SUCCESS",
          priority: "HIGH",
        },
      });
    }

    // Log admin activity
    await db.activityLog.create({
      data: {
        userId: dbUser.id,
        action: approve ? "APPROVE_ONBOARDING" : "REJECT_ONBOARDING",
        details: `${approve ? "Approved" : "Rejected"} onboarding review for client: ${client.companyName || client.user.email}`,
      },
    });

    revalidatePath("/admin/onboarding");
    return { success: true };
  } catch (error: any) {
    console.error("approveOnboardingAction error:", error);
    return { success: false, error: error.message || "Failed to process onboarding decision" };
  }
}

export async function getClientsAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user || !["Super Admin", "Admin", "Accountant", "Project Manager", "Sales Executive"].includes(user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const clients = await db.client.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        companyName: "asc",
      },
    });

    return { success: true, clients };
  } catch (error: any) {
    console.error("getClientsAction error:", error);
    return { success: false, error: error.message || "Failed to fetch clients" };
  }
}


