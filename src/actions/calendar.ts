"use server";

import { db } from "@/lib/db";
import { getCurrentUserAction } from "./auth";
import { revalidatePath } from "next/cache";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  type: "PROJECT" | "TASK" | "LEAD_FOLLOWUP" | "MEETING" | "LEAVE";
  status: string;
  priority?: string;
  link?: string;
  meta?: any;
}

export async function getCalendarEventsAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const events: CalendarEvent[] = [];

    // 1. Fetch active projects
    const projects = await db.project.findMany({
      where: {
        startDate: { not: null },
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        status: true,
      },
    });

    for (const proj of projects) {
      if (proj.startDate) {
        events.push({
          id: `proj-${proj.id}`,
          title: `Project: ${proj.title}`,
          description: proj.description || "",
          start: proj.startDate.toISOString(),
          end: proj.endDate ? proj.endDate.toISOString() : proj.startDate.toISOString(),
          type: "PROJECT",
          status: proj.status,
          link: `/admin/projects`,
        });
      }
    }

    // 2. Fetch task deadlines
    const tasks = await db.task.findMany({
      where: {
        deadline: { not: null },
      },
      select: {
        id: true,
        title: true,
        description: true,
        deadline: true,
        status: true,
        priority: true,
      },
    });

    for (const task of tasks) {
      if (task.deadline) {
        events.push({
          id: `task-${task.id}`,
          title: `Task Due: ${task.title}`,
          description: task.description || "",
          start: task.deadline.toISOString(),
          end: task.deadline.toISOString(),
          type: "TASK",
          status: task.status,
          priority: task.priority,
          link: `/admin/tasks`,
        });
      }
    }

    // 3. Fetch lead followups
    const leads = await db.lead.findMany({
      where: {
        followUpDate: { not: null },
      },
      select: {
        id: true,
        clientName: true,
        companyName: true,
        followUpDate: true,
        status: true,
        priority: true,
      },
    });

    for (const lead of leads) {
      if (lead.followUpDate) {
        events.push({
          id: `lead-${lead.id}`,
          title: `Follow Up: ${lead.clientName} (${lead.companyName || "Direct"})`,
          description: `Follow up stage: ${lead.status}`,
          start: lead.followUpDate.toISOString(),
          end: lead.followUpDate.toISOString(),
          type: "LEAD_FOLLOWUP",
          status: lead.status,
          priority: lead.priority,
          link: `/admin/crm`,
        });
      }
    }

    // 4. Fetch meetings
    const meetings = await db.meeting.findMany({
      include: {
        host: {
          select: { name: true, email: true },
        },
      },
    });

    for (const m of meetings) {
      events.push({
        id: `meet-${m.id}`,
        title: `Meeting: ${m.title}`,
        description: m.description || "",
        start: m.startTime.toISOString(),
        end: m.endTime.toISOString(),
        type: "MEETING",
        status: "SCHEDULED",
        link: m.link || undefined,
        meta: {
          host: m.host.name || m.host.email,
          attendees: m.attendees ? JSON.parse(m.attendees) : [],
        },
      });
    }

    // 5. Fetch approved/pending leaves
    const leaves = await db.leave.findMany({
      include: {
        employee: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    for (const leave of leaves) {
      events.push({
        id: `leave-${leave.id}`,
        title: `Leave: ${leave.employee.user.name || leave.employee.user.email} (${leave.leaveType})`,
        description: `Reason: ${leave.reason} (${leave.status})`,
        start: leave.startDate.toISOString(),
        end: leave.endDate.toISOString(),
        type: "LEAVE",
        status: leave.status,
        link: `/admin/employees`,
      });
    }

    return { success: true, events };
  } catch (error: any) {
    console.error("getCalendarEventsAction error:", error);
    return { success: false, error: error.message || "Failed to fetch calendar events" };
  }
}

export async function createMeetingAction(data: {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: string; // INTERNAL, CLIENT
  link?: string;
  attendees?: string[]; // email strings
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
    });
    if (!dbUser) return { success: false, error: "Host profile not found" };

    const meeting = await db.meeting.create({
      data: {
        title: data.title,
        description: data.description || null,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        type: data.type || "INTERNAL",
        link: data.link || `https://meet.jit.si/${encodeURIComponent(data.title.replace(/\s+/g, "-"))}`,
        hostId: dbUser.id,
        attendees: data.attendees ? JSON.stringify(data.attendees) : null,
      },
    });

    // Create notifications for attendees if they are registered users
    if (data.attendees && data.attendees.length > 0) {
      const attendeeUsers = await db.user.findMany({
        where: { email: { in: data.attendees } },
      });

      for (const aUser of attendeeUsers) {
        await db.notification.create({
          data: {
            userId: aUser.id,
            title: "New Meeting Invitation",
            content: `You have been invited to meeting: "${data.title}" on ${new Date(data.startTime).toLocaleString()}. Link: ${meeting.link}`,
            type: "INFO",
            priority: "MEDIUM",
          },
        });
      }
    }

    revalidatePath("/admin/calendar");
    return { success: true, meeting };
  } catch (error: any) {
    console.error("createMeetingAction error:", error);
    return { success: false, error: error.message || "Failed to create meeting event" };
  }
}
