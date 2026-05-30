"use server";

import { db } from "@/lib/db";
import { getCurrentUserAction } from "./auth";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import path from "path";

export async function getLeadsAction() {
  try {
    const leads = await db.lead.findMany({
      include: {
        assignedEmployee: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        interactions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return { success: true, leads };
  } catch (error: any) {
    console.error("getLeadsAction error:", error);
    return { success: false, error: error.message || "Failed to fetch leads" };
  }
}

export async function createLeadAction(data: {
  clientName: string;
  companyName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  source?: string;
  assignedEmployeeId?: string;
  estimatedBudget?: number;
  servicesInterested?: string;
  priority?: string;
  notes?: string;
  followUpDate?: string;
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const lead = await db.lead.create({
      data: {
        clientName: data.clientName,
        companyName: data.companyName || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        source: data.source || "Direct",
        assignedEmployeeId: data.assignedEmployeeId || null,
        estimatedBudget: data.estimatedBudget || 0.0,
        servicesInterested: data.servicesInterested || null,
        priority: data.priority || "MEDIUM",
        notes: data.notes || null,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        status: "NEW",
      },
    });

    // Create interaction log for creation
    await db.interactionLog.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        content: `Lead created by ${user.name || user.email}`,
      },
    });

    // Log Activity
    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (dbUser) {
      await db.activityLog.create({
        data: {
          userId: dbUser.id,
          action: "CREATE_LEAD",
          details: `Created lead for client: ${data.clientName}`,
        },
      });

      // Dispatch Notification if assigned to someone
      if (data.assignedEmployeeId) {
        const employee = await db.employee.findUnique({
          where: { id: data.assignedEmployeeId },
          select: { userId: true },
        });
        if (employee) {
          await db.notification.create({
            data: {
              userId: employee.userId,
              title: "New Lead Assigned",
              content: `Lead ${data.clientName} has been assigned to you.`,
              type: "INFO",
              priority: "MEDIUM",
            },
          });
        }
      }
    }

    revalidatePath("/admin/crm");
    return { success: true, lead };
  } catch (error: any) {
    console.error("createLeadAction error:", error);
    return { success: false, error: error.message || "Failed to create lead" };
  }
}

export async function updateLeadStageAction(leadId: string, stage: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const oldLead = await db.lead.findUnique({ where: { id: leadId } });
    if (!oldLead) return { success: false, error: "Lead not found" };

    const lead = await db.lead.update({
      where: { id: leadId },
      data: { status: stage },
    });

    // Log interaction log
    await db.interactionLog.create({
      data: {
        leadId,
        type: "NOTE",
        content: `Stage updated from ${oldLead.status} to ${stage} by ${user.name || user.email}`,
      },
    });

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (dbUser) {
      await db.activityLog.create({
        data: {
          userId: dbUser.id,
          action: "UPDATE_LEAD_STAGE",
          details: `Updated lead ${lead.clientName} stage to ${stage}`,
        },
      });

      // Notify owner if exists
      if (lead.assignedEmployeeId) {
        const employee = await db.employee.findUnique({
          where: { id: lead.assignedEmployeeId },
          select: { userId: true },
        });
        if (employee) {
          await db.notification.create({
            data: {
              userId: employee.userId,
              title: "Lead Updated",
              content: `Lead ${lead.clientName} moved to stage ${stage}.`,
              type: "INFO",
              priority: "LOW",
            },
          });
        }
      }
    }

    revalidatePath("/admin/crm");
    return { success: true, lead };
  } catch (error: any) {
    console.error("updateLeadStageAction error:", error);
    return { success: false, error: error.message || "Failed to update lead status" };
  }
}

export async function addInteractionLogAction(leadId: string, type: string, content: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    const log = await db.interactionLog.create({
      data: {
        leadId,
        type,
        content,
        employeeId: dbUser.id,
      },
    });

    // Update lead last interaction
    await db.lead.update({
      where: { id: leadId },
      data: { lastInteraction: new Date() },
    });

    revalidatePath("/admin/crm");
    return { success: true, log };
  } catch (error: any) {
    console.error("addInteractionLogAction error:", error);
    return { success: false, error: error.message || "Failed to add interaction note" };
  }
}

export async function scheduleFollowUpAction(leadId: string, date: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const followUpDate = new Date(date);
    const lead = await db.lead.update({
      where: { id: leadId },
      data: {
        followUpDate,
        status: "FOLLOW_UP",
      },
    });

    await db.interactionLog.create({
      data: {
        leadId,
        type: "MEETING",
        content: `Scheduled follow-up for ${followUpDate.toLocaleString()} by ${user.name || user.email}`,
      },
    });

    revalidatePath("/admin/crm");
    return { success: true, lead };
  } catch (error: any) {
    console.error("scheduleFollowUpAction error:", error);
    return { success: false, error: error.message || "Failed to schedule follow-up" };
  }
}

export async function getLeadAnalyticsAction() {
  try {
    const leads = await db.lead.findMany();
    const total = leads.length;
    
    const stages = {
      NEW: 0,
      CONTACTED: 0,
      FOLLOW_UP: 0,
      INTERESTED: 0,
      PROPOSAL_SENT: 0,
      NEGOTIATION: 0,
      WON: 0,
      LOST: 0,
    } as Record<string, number>;

    const sources = {} as Record<string, number>;

    leads.forEach((l) => {
      if (stages[l.status] !== undefined) {
        stages[l.status]++;
      }
      sources[l.source] = (sources[l.source] || 0) + 1;
    });

    return {
      success: true,
      analytics: {
        total,
        stages,
        sources,
        conversionRate: total > 0 ? (stages["WON"] / total) * 100 : 0,
      },
    };
  } catch (error: any) {
    console.error("getLeadAnalyticsAction error:", error);
    return { success: false, error: error.message || "Failed to compile lead analytics" };
  }
}

export async function submitPublicContactFormAction(data: {
  clientName: string;
  companyName?: string;
  phone?: string;
  email?: string;
  servicesInterested?: string;
  budgetRange?: string;
  timeline?: string;
  contactMethod?: string;
  projectBrief?: string;
}) {
  try {
    let numericBudget = 0.0;
    if (data.budgetRange === "< $2,500") numericBudget = 2500.0;
    else if (data.budgetRange === "$2,500 - $10,000") numericBudget = 5000.0;
    else if (data.budgetRange === "$10,000 - $25,000") numericBudget = 15000.0;
    else if (data.budgetRange === "$25,000+") numericBudget = 25000.0;

    const richNotes = `
Preferred Contact Method: ${data.contactMethod || "Not specified"}
Project Timeline: ${data.timeline || "Not specified"}
Budget Range: ${data.budgetRange || "Flexible"}

Project Brief:
${data.projectBrief || "No project brief provided."}
    `.trim();

    const lead = await db.lead.create({
      data: {
        clientName: data.clientName,
        companyName: data.companyName || null,
        phone: data.phone || null,
        email: data.email || null,
        servicesInterested: data.servicesInterested || null,
        estimatedBudget: numericBudget,
        notes: richNotes,
        source: "Public Contact Form",
        priority: "MEDIUM",
        status: "NEW",
      },
    });

    // Create interaction log
    await db.interactionLog.create({
      data: {
        leadId: lead.id,
        type: "EMAIL",
        content: `Public Lead submitted with rich project specifications. System sent automatic confirmation email.`,
      },
    });

    // Send confirmation email if email is provided
    if (data.email) {
      const emailBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #f3f4f6; padding-bottom: 20px;">
            <img src="cid:logo" alt="The Blue Intellect" style="height: 38px; width: auto; display: inline-block; object-fit: contain;" />
          </div>
          <div style="color: #1f2937;">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Hello ${data.clientName},</p>
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
              Thank you for reaching out to **The Blue Intellect**! We have successfully registered your project specifications in our central control hub. Our design directors and technical architects are reviewing your brief.
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em;">Project Inquiry Blueprint</h3>
              <table style="width: 100%; font-size: 13px; border-collapse: collapse; line-height: 1.8;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b; width: 150px; vertical-align: top;">Name:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${data.clientName}</td>
                </tr>
                ${data.companyName ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b; vertical-align: top;">Company Name:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${data.companyName}</td>
                </tr>` : ""}
                ${data.phone ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b; vertical-align: top;">Mobile Number:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${data.phone}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b; vertical-align: top;">Email Reference:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${data.email}</td>
                </tr>
                ${data.servicesInterested ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b; vertical-align: top;">Service Required:</td>
                  <td style="padding: 6px 0; color: #2563eb; font-weight: 700;">${data.servicesInterested}</td>
                </tr>` : ""}
                ${data.timeline ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b; vertical-align: top;">Expected Timeline:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${data.timeline}</td>
                </tr>` : ""}
                ${data.budgetRange ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b; vertical-align: top;">Budget Scope:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${data.budgetRange}</td>
                </tr>` : ""}
                ${data.contactMethod ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #64748b; vertical-align: top;">Preferred Contact:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${data.contactMethod}</td>
                </tr>` : ""}
              </table>
              
              ${data.projectBrief ? `
              <div style="margin-top: 15px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                <p style="margin: 0 0 5px 0; font-weight: bold; color: #64748b; font-size: 13px;">Project Brief & Goals:</p>
                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${data.projectBrief}</div>
              </div>` : ""}
            </div>
            
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
              Our dedicated coordinator typically triggers a follow-up consultation call or WhatsApp message within **4 to 6 business hours** to coordinate schedules. 
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 0;">
              If you have specific files, layouts, or spreadsheets to share, you can reply directly to this email at <a href="mailto:info@theblueintellect.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">info@theblueintellect.com</a>.
            </p>
            <p style="font-size: 14px; margin-bottom: 0; color: #4b5563; padding-top: 20px;">
              Best regards,<br />
              <strong>The Blue Intellect Team</strong>
            </p>
          </div>
          <div style="border-top: 1px solid #f3f4f6; margin-top: 35px; padding-top: 20px; text-align: center; font-size: 11px; color: #9ca3af; line-height: 1.5;">
            &copy; ${new Date().getFullYear()} The Blue Intellect. All rights reserved.<br />
            Office: B-92, Kohinoor Colony, Tulshibagwale Colony, Parvati Paytha, Pune, Maharashtra 411009
          </div>
        </div>
      `;

      await sendEmail({
        to: data.email,
        subject: `We received your inquiry regarding ${data.servicesInterested || "digital solutions"} - The Blue Intellect`,
        html: emailBody,
        text: `Hello ${data.clientName},\n\nThank you for reaching out to The Blue Intellect! We have successfully received your project specifications for "${data.servicesInterested || "our digital solutions"}".\n\nSubmission Details:\n- Name: ${data.clientName}\n- Company: ${data.companyName || "N/A"}\n- Service Interested: ${data.servicesInterested}\n- Timeline: ${data.timeline || "N/A"}\n- Budget Range: ${data.budgetRange || "Flexible"}\n- Preferred Contact Method: ${data.contactMethod || "N/A"}\n\nOur team typically responds within 4-6 business hours.\n\nBest regards,\nThe Blue Intellect Team\ninfo@theblueintellect.com`,
        attachments: [
          {
            filename: "logo.png",
            path: path.join(process.cwd(), "public/images/logo.png"),
            cid: "logo",
          },
        ],
      });
    }

    revalidatePath("/admin/crm");
    return { success: true, lead };
  } catch (error: any) {
    console.error("submitPublicContactFormAction error:", error);
    return { success: false, error: error.message || "Failed to submit request" };
  }
}
