"use server";

import { db } from "@/lib/db";
import { getCurrentUserAction } from "./auth";
import { revalidatePath } from "next/cache";

export async function getProjectsListAction() {
  try {
    const projects = await db.project.findMany({
      include: {
        category: true,
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
        team: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignedTo: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            subtasks: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return { success: true, projects };
  } catch (error: any) {
    console.error("getProjectsListAction error:", error);
    return { success: false, error: error.message || "Failed to fetch projects" };
  }
}

export async function createProjectItemAction(data: {
  title: string;
  description: string;
  categoryId: string;
  projectType: string;
  thumbnail: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  teamIds?: string[];
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Check if slug exists, append random if needed
    const existingProject = await db.project.findUnique({ where: { slug } });
    const dynamicSlug = existingProject ? `${slug}-${Math.floor(100 + Math.random() * 900)}` : slug;

    const project = await db.project.create({
      data: {
        title: data.title,
        slug: dynamicSlug,
        description: data.description,
        categoryId: data.categoryId,
        projectType: data.projectType,
        thumbnail: data.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
        clientId: data.clientId || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: "PLANNING",
        healthScore: 100,
        team: data.teamIds ? {
          connect: data.teamIds.map((id) => ({ id })),
        } : undefined,
      },
    });

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (dbUser) {
      await db.activityLog.create({
        data: {
          userId: dbUser.id,
          action: "CREATE_PROJECT",
          details: `Created project: ${data.title}`,
        },
      });
    }

    revalidatePath("/admin/projects");
    return { success: true, project };
  } catch (error: any) {
    console.error("createProjectItemAction error:", error);
    return { success: false, error: error.message || "Failed to create project" };
  }
}

export async function updateProjectStageAction(projectId: string, status: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const project = await db.project.update({
      where: { id: projectId },
      data: { status },
    });

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (dbUser) {
      await db.activityLog.create({
        data: {
          userId: dbUser.id,
          action: "UPDATE_PROJECT_STAGE",
          details: `Updated project ${project.title} status to ${status}`,
        },
      });
    }

    revalidatePath("/admin/projects");
    return { success: true, project };
  } catch (error: any) {
    console.error("updateProjectStageAction error:", error);
    return { success: false, error: error.message || "Failed to update project stage" };
  }
}

export async function createTaskAction(data: {
  projectId: string;
  title: string;
  description?: string;
  priority?: string;
  deadline?: string;
  assignedToId?: string;
  dependencyIds?: string[];
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    const task = await db.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description || null,
        priority: data.priority || "MEDIUM",
        deadline: data.deadline ? new Date(data.deadline) : null,
        assignedToId: data.assignedToId || null,
        creatorId: dbUser.id,
        status: "TODO",
      },
    });

    // Create Dependencies
    if (data.dependencyIds && data.dependencyIds.length > 0) {
      await db.taskDependency.createMany({
        data: data.dependencyIds.map((depId) => ({
          taskId: task.id,
          dependsOnId: depId,
        })),
      });
    }

    // Log Activity
    await db.activityLog.create({
      data: {
        userId: dbUser.id,
        action: "CREATE_TASK",
        details: `Created task: ${data.title} under project ID ${data.projectId}`,
      },
    });

    // Notify assignee
    if (data.assignedToId) {
      const employee = await db.employee.findUnique({
        where: { id: data.assignedToId },
        select: { userId: true },
      });
      if (employee) {
        await db.notification.create({
          data: {
            userId: employee.userId,
            title: "New Task Assigned",
            content: `You have been assigned task: "${data.title}"`,
            type: "INFO",
            priority: data.priority === "URGENT" ? "HIGH" : "MEDIUM",
          },
        });
      }
    }

    revalidatePath("/admin/tasks");
    revalidatePath("/admin/projects");
    return { success: true, task };
  } catch (error: any) {
    console.error("createTaskAction error:", error);
    return { success: false, error: error.message || "Failed to create task" };
  }
}

export async function updateTaskStatusAction(taskId: string, status: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const oldTask = await db.task.findUnique({
      where: { id: taskId },
      select: { status: true, title: true, projectId: true },
    });

    if (!oldTask) return { success: false, error: "Task not found" };

    const task = await db.task.update({
      where: { id: taskId },
      data: { status },
    });

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (dbUser) {
      await db.activityLog.create({
        data: {
          userId: dbUser.id,
          action: "UPDATE_TASK_STATUS",
          details: `Updated task "${task.title}" status to ${status}`,
        },
      });

      // If completed, notify task creator
      if (status === "COMPLETED" && task.creatorId) {
        await db.notification.create({
          data: {
            userId: task.creatorId,
            title: "Task Completed",
            content: `The task "${task.title}" has been marked as Completed.`,
            type: "SUCCESS",
            priority: "LOW",
          },
        });
      }
    }

    revalidatePath("/admin/tasks");
    revalidatePath("/admin/projects");
    return { success: true, task };
  } catch (error: any) {
    console.error("updateTaskStatusAction error:", error);
    return { success: false, error: error.message || "Failed to update task status" };
  }
}

export async function addSubtaskAction(taskId: string, title: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const subtask = await db.subtask.create({
      data: {
        taskId,
        title,
        isCompleted: false,
      },
    });

    revalidatePath("/admin/tasks");
    return { success: true, subtask };
  } catch (error: any) {
    console.error("addSubtaskAction error:", error);
    return { success: false, error: error.message || "Failed to add subtask" };
  }
}

export async function toggleSubtaskAction(subtaskId: string, isCompleted: boolean) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const subtask = await db.subtask.update({
      where: { id: subtaskId },
      data: { isCompleted },
    });

    revalidatePath("/admin/tasks");
    return { success: true, subtask };
  } catch (error: any) {
    console.error("toggleSubtaskAction error:", error);
    return { success: false, error: error.message || "Failed to toggle subtask" };
  }
}

export async function addTaskCommentAction(taskId: string, content: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    const comment = await db.comment.create({
      data: {
        taskId,
        content,
        userId: dbUser.id,
      },
    });

    revalidatePath("/admin/tasks");
    return { success: true, comment };
  } catch (error: any) {
    console.error("addTaskCommentAction error:", error);
    return { success: false, error: error.message || "Failed to add comment" };
  }
}
