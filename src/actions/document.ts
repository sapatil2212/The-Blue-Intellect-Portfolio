"use server";

import { db } from "@/lib/db";
import { getCurrentUserAction } from "./auth";
import { revalidatePath } from "next/cache";

export async function getDocumentsAction() {
  try {
    const documents = await db.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, documents };
  } catch (error: any) {
    console.error("getDocumentsAction error:", error);
    return { success: false, error: error.message || "Failed to fetch documents" };
  }
}

export async function uploadDocumentAction(data: {
  name: string;
  fileUrl: string;
  fileType: string;
  folder?: string;
  tag?: string;
  accessLevel?: string;
  sizeBytes?: number;
}) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    const document = await db.document.create({
      data: {
        name: data.name,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        folder: data.folder || "General",
        tag: data.tag || null,
        accessLevel: data.accessLevel || "PUBLIC",
        ownerId: dbUser.id,
        sizeBytes: data.sizeBytes || 0,
      },
    });

    await db.activityLog.create({
      data: {
        userId: dbUser.id,
        action: "UPLOAD_DOCUMENT",
        details: `Uploaded file "${data.name}" in folder "${data.folder || "General"}"`,
      },
    });

    revalidatePath("/admin/documents");
    return { success: true, document };
  } catch (error: any) {
    console.error("uploadDocumentAction error:", error);
    return { success: false, error: error.message || "Failed to log document" };
  }
}

export async function deleteDocumentAction(documentId: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const doc = await db.document.findUnique({ where: { id: documentId } });
    if (!doc) return { success: false, error: "Document not found" };

    await db.document.delete({
      where: { id: documentId },
    });

    const dbUser = await db.user.findUnique({ where: { email: user.email } });
    if (dbUser) {
      await db.activityLog.create({
        data: {
          userId: dbUser.id,
          action: "DELETE_DOCUMENT",
          details: `Deleted file "${doc.name}"`,
        },
      });
    }

    revalidatePath("/admin/documents");
    return { success: true };
  } catch (error: any) {
    console.error("deleteDocumentAction error:", error);
    return { success: false, error: error.message || "Failed to delete document" };
  }
}
