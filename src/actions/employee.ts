"use server";

import { db } from "@/lib/db";
import { getCurrentUserAction } from "./auth";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getEmployeesAction() {
  try {
    const employees = await db.employee.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
        manager: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        attendance: {
          orderBy: {
            date: "desc",
          },
          take: 30, // Last 30 attendance records
        },
        leaves: {
          orderBy: {
            startDate: "desc",
          },
        },
        standups: {
          orderBy: {
            date: "desc",
          },
          take: 7, // Last 7 standup submissions
        },
      },
      orderBy: {
        joiningDate: "desc",
      },
    });
    return { success: true, employees };
  } catch (error: any) {
    console.error("getEmployeesAction error:", error);
    return { success: false, error: error.message || "Failed to fetch employees" };
  }
}

export async function inviteEmployeeAction(data: {
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  skills?: string;
  phone?: string;
  emergencyContact?: string;
  managerId?: string;
}) {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) return { success: false, error: "Unauthorized" };

    const requestingUser = await db.user.findUnique({
      where: { email: activeUser.email },
    });

    if (!requestingUser || !["Super Admin", "Admin", "HR"].includes(requestingUser.role)) {
      return { success: false, error: "Unauthorized: Access limited to Admins and HR" };
    }

    const email = data.email.toLowerCase().trim();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "A user with this email already exists" };
    }

    // Hash a default temporary password
    const tempPasswordHash = hashPassword("WelcomeAether2026!");

    const user = await db.user.create({
      data: {
        email,
        name: data.name,
        password: tempPasswordHash,
        role: data.role,
        status: "ACTIVE", // Invited employees are active by default so they can login immediately
      },
    });

    // Create Employee record
    const empId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const employee = await db.employee.create({
      data: {
        userId: user.id,
        employeeId: empId,
        department: data.department,
        salary: Number(data.salary) || 0.0,
        skills: data.skills || null,
        phone: data.phone || null,
        emergencyContact: data.emergencyContact || null,
        managerId: data.managerId || null,
      },
    });

    // Log Activity
    await db.activityLog.create({
      data: {
        userId: requestingUser.id,
        action: "INVITE_EMPLOYEE",
        details: `Invited employee ${data.name} (${email}) as ${data.role} in ${data.department}`,
      },
    });

    // Notify User
    await db.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to AetherOS!",
        content: `Your profile has been created as a ${data.role} in the ${data.department} department. Use temporary password "WelcomeAether2026!" to log in.`,
        type: "SUCCESS",
        priority: "HIGH",
      },
    });

    revalidatePath("/admin/employees");
    return { success: true, employee };
  } catch (error: any) {
    console.error("inviteEmployeeAction error:", error);
    return { success: false, error: error.message || "Failed to invite employee" };
  }
}

export async function clockInAction(notes?: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { employee: true },
    });

    if (!dbUser || !dbUser.employee) {
      return { success: false, error: "No employee profile found for user" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await db.attendance.findFirst({
      where: {
        employeeId: dbUser.employee.id,
        date: {
          gte: today,
        },
      },
    });

    if (existingAttendance) {
      return { success: false, error: "You have already clocked in today" };
    }

    // Detect late clock in (after 10:00 AM)
    const now = new Date();
    const isLate = now.getHours() >= 10;

    const attendance = await db.attendance.create({
      data: {
        employeeId: dbUser.employee.id,
        clockIn: new Date(),
        status: isLate ? "LATE" : "PRESENT",
        notes: notes || null,
      },
    });

    revalidatePath("/admin/employees");
    return { success: true, attendance };
  } catch (error: any) {
    console.error("clockInAction error:", error);
    return { success: false, error: error.message || "Failed to clock in" };
  }
}

export async function clockOutAction(notes?: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { employee: true },
    });

    if (!dbUser || !dbUser.employee) {
      return { success: false, error: "No employee profile found for user" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeAttendance = await db.attendance.findFirst({
      where: {
        employeeId: dbUser.employee.id,
        date: { gte: today },
        clockOut: null,
      },
    });

    if (!activeAttendance) {
      return { success: false, error: "No active attendance found to clock out" };
    }

    const attendance = await db.attendance.update({
      where: { id: activeAttendance.id },
      data: {
        clockOut: new Date(),
        notes: notes ? `${activeAttendance.notes || ""}\nClockout: ${notes}`.trim() : activeAttendance.notes,
      },
    });

    revalidatePath("/admin/employees");
    return { success: true, attendance };
  } catch (error: any) {
    console.error("clockOutAction error:", error);
    return { success: false, error: error.message || "Failed to clock out" };
  }
}

export async function applyForLeaveAction(data: {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { employee: true },
    });

    if (!dbUser || !dbUser.employee) {
      return { success: false, error: "Employee profile not found" };
    }

    const leave = await db.leave.create({
      data: {
        employeeId: dbUser.employee.id,
        leaveType: data.leaveType,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        status: "PENDING",
      },
    });

    // Notify Manager or HR
    const administrators = await db.user.findMany({
      where: {
        role: { in: ["Super Admin", "Admin", "HR"] },
      },
    });

    for (const admin of administrators) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: "Leave Application Received",
          content: `${user.name || user.email} requested ${data.leaveType} leave from ${data.startDate} to ${data.endDate}.`,
          type: "WARNING",
          priority: "MEDIUM",
        },
      });
    }

    revalidatePath("/admin/employees");
    return { success: true, leave };
  } catch (error: any) {
    console.error("applyForLeaveAction error:", error);
    return { success: false, error: error.message || "Failed to apply for leave" };
  }
}

export async function approveLeaveAction(leaveId: string, status: string) {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) return { success: false, error: "Unauthorized" };

    const requestingUser = await db.user.findUnique({
      where: { email: activeUser.email },
    });

    if (!requestingUser || !["Super Admin", "Admin", "HR"].includes(requestingUser.role)) {
      return { success: false, error: "Unauthorized: Access limited to HR and Admins" };
    }

    const originalLeave = await db.leave.findUnique({
      where: { id: leaveId },
      include: { employee: { include: { user: true } } },
    });

    if (!originalLeave) return { success: false, error: "Leave application not found" };

    const leave = await db.leave.update({
      where: { id: leaveId },
      data: {
        status,
        approvedById: requestingUser.id,
      },
    });

    // Notify employee
    await db.notification.create({
      data: {
        userId: originalLeave.employee.user.id,
        title: `Leave Application ${status}`,
        content: `Your request for ${originalLeave.leaveType} leave from ${originalLeave.startDate.toLocaleDateString()} has been ${status.toLowerCase()}.`,
        type: status === "APPROVED" ? "SUCCESS" : "ERROR",
        priority: "HIGH",
      },
    });

    revalidatePath("/admin/employees");
    return { success: true, leave };
  } catch (error: any) {
    console.error("approveLeaveAction error:", error);
    return { success: false, error: error.message || "Failed to update leave" };
  }
}

export async function submitDailyStandupAction(data: {
  completedYesterday: string;
  planningToday: string;
  blockers?: string;
  productivityScore?: number;
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { employee: true },
    });

    if (!dbUser || !dbUser.employee) {
      return { success: false, error: "Employee profile not found" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingStandup = await db.standup.findFirst({
      where: {
        employeeId: dbUser.employee.id,
        date: { gte: today },
      },
    });

    if (existingStandup) {
      return { success: false, error: "You have already submitted a standup report today" };
    }

    const standup = await db.standup.create({
      data: {
        employeeId: dbUser.employee.id,
        completedYesterday: data.completedYesterday,
        planningToday: data.planningToday,
        blockers: data.blockers || null,
        productivityScore: Number(data.productivityScore) || 100,
      },
    });

    revalidatePath("/admin/employees");
    return { success: true, standup };
  } catch (error: any) {
    console.error("submitDailyStandupAction error:", error);
    return { success: false, error: error.message || "Failed to submit standup report" };
  }
}

export async function getLeaderboardAction() {
  try {
    // Basic aggregation: calculate completed tasks and average productivity scores
    const employees = await db.employee.findMany({
      include: {
        user: { select: { name: true, email: true, role: true } },
        tasks: { where: { status: "COMPLETED" } },
        standups: { select: { productivityScore: true } },
        leads: { select: { status: true } },
      },
    });

    const leaderboard = employees.map((emp) => {
      const completedTasks = emp.tasks.length;
      
      const totalStandups = emp.standups.length;
      const averageProductivity = totalStandups > 0
        ? emp.standups.reduce((acc, st) => acc + st.productivityScore, 0) / totalStandups
        : 100;

      const totalLeads = emp.leads.length;
      const wonLeads = emp.leads.filter((l) => l.status === "WON").length;
      const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

      return {
        id: emp.id,
        name: emp.user.name || emp.user.email,
        email: emp.user.email,
        role: emp.user.role,
        department: emp.department,
        completedTasks,
        averageProductivity: Math.round(averageProductivity),
        conversionRate: Math.round(conversionRate * 10) / 10,
        score: Math.round((completedTasks * 10) + averageProductivity + (conversionRate * 2)),
      };
    });

    // Sort by final score descending
    leaderboard.sort((a, b) => b.score - a.score);

    return { success: true, leaderboard };
  } catch (error: any) {
    console.error("getLeaderboardAction error:", error);
    return { success: false, error: error.message || "Failed to fetch leaderboard" };
  }
}
