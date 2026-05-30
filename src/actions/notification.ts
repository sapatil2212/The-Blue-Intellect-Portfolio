"use server";

import { db } from "@/lib/db";
import { getCurrentUserAction } from "./auth";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function getNotificationsAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return { success: false, error: "User not found" };

    const notifications = await db.notification.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, notifications };
  } catch (error: any) {
    console.error("getNotificationsAction error:", error);
    return { success: false, error: error.message || "Failed to fetch notifications" };
  }
}

export async function markAsReadAction(notificationId: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const notification = await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    revalidatePath("/admin");
    return { success: true, notification };
  } catch (error: any) {
    console.error("markAsReadAction error:", error);
    return { success: false, error: error.message || "Failed to update notification" };
  }
}

export async function dispatchNotificationAction(data: {
  userId: string;
  title: string;
  content: string;
  type?: string;
  priority?: string;
  sendEmailAlert?: boolean;
  sendWhatsAppMock?: boolean;
}) {
  try {
    const user = await db.user.findUnique({
      where: { id: data.userId },
      include: { employee: true, client: true },
    });

    if (!user) return { success: false, error: "Target user not found" };

    // 1. Create In-App Notification
    const notification = await db.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        type: data.type || "INFO",
        priority: data.priority || "LOW",
      },
    });

    // 2. Optional Email dispatch (via Gmail SMTP configuration in .env)
    if (data.sendEmailAlert) {
      try {
        await sendEmail({
          to: user.email,
          subject: `[The Blue Intellect Alert] ${data.title}`,
          text: data.content,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
              <h3 style="color: #3b82f6; margin-top: 0;">${data.title}</h3>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">${data.content}</p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
              <p style="color: #9ca3af; font-size: 11px;">This is an automated operational email from The Blue Intellect. Please do not reply directly.</p>
            </div>
          `,
        });
      } catch (err) {
        console.warn("Failed to dispatch SMTP email:", err);
      }
    }

    // 3. Optional WhatsApp campaign scheduling (WhatsApp queue system)
    if (data.sendWhatsAppMock) {
      const phone = user.employee?.phone || user.client?.phone || "";
      if (phone) {
        await db.whatsAppQueue.create({
          data: {
            recipientPhone: phone,
            templateName: "operational_alert",
            variables: JSON.stringify({
              title: data.title,
              body: data.content,
            }),
            status: "PENDING",
            scheduledFor: new Date(),
          },
        });
      }
    }

    return { success: true, notification };
  } catch (error: any) {
    console.error("dispatchNotificationAction error:", error);
    return { success: false, error: error.message || "Failed to dispatch notification" };
  }
}

// WhatsApp automation architecture mock simulator views
export async function getWhatsAppQueueStatusAction() {
  try {
    const queue = await db.whatsAppQueue.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, queue };
  } catch (error: any) {
    console.error("getWhatsAppQueueStatusAction error:", error);
    return { success: false, error: error.message || "Failed to fetch WhatsApp queue status" };
  }
}

export async function addWhatsAppQueueItemAction(data: {
  recipientPhone: string;
  templateName: string;
  variables: Record<string, string>;
  scheduledSecondsDelay?: number;
}) {
  try {
    const delay = data.scheduledSecondsDelay || 0;
    const scheduledFor = new Date(Date.now() + delay * 1000);

    const queueItem = await db.whatsAppQueue.create({
      data: {
        recipientPhone: data.recipientPhone,
        templateName: data.templateName,
        variables: JSON.stringify(data.variables),
        status: "PENDING",
        scheduledFor,
      },
    });

    return { success: true, queueItem };
  } catch (error: any) {
    console.error("addWhatsAppQueueItemAction error:", error);
    return { success: false, error: error.message || "Failed to queue WhatsApp item" };
  }
}

export async function processWhatsAppQueueItemAction(id: string) {
  try {
    const item = await db.whatsAppQueue.update({
      where: { id },
      data: {
        status: "SENT",
        processedAt: new Date(),
      },
    });
    return { success: true, item };
  } catch (error: any) {
    console.error("processWhatsAppQueueItemAction error:", error);
    return { success: false, error: error.message || "Failed to process WhatsApp queue item" };
  }
}
