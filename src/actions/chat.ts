"use server";

import { db } from "@/lib/db";
import { getCurrentUserAction } from "./auth";
import { revalidatePath } from "next/cache";

// Bootstrapping channels
const DEFAULT_CHANNELS = [
  { name: "#general", isPrivate: false },
  { name: "#announcements", isPrivate: false },
  { name: "#design", isPrivate: false },
  { name: "#development", isPrivate: false },
];

export async function getChannelsAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    let channels = await db.chatChannel.findMany({
      orderBy: { name: "asc" },
    });

    if (channels.length === 0) {
      console.log("No channels found. Bootstrapping default channels...");
      await db.chatChannel.createMany({
        data: DEFAULT_CHANNELS,
      });
      channels = await db.chatChannel.findMany({
        orderBy: { name: "asc" },
      });
    }

    return { success: true, channels };
  } catch (error: any) {
    console.error("getChannelsAction error:", error);
    return { success: false, error: error.message || "Failed to fetch channels" };
  }
}

export async function getChannelMessagesAction(channelId: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const messages = await db.chatMessage.findMany({
      where: { channelId },
      orderBy: { createdAt: "asc" },
      take: 100, // Fetch last 100 messages
    });

    return { success: true, messages };
  } catch (error: any) {
    console.error("getChannelMessagesAction error:", error);
    return { success: false, error: error.message || "Failed to fetch channel messages" };
  }
}

export async function sendChannelMessageAction(channelId: string, content: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return { success: false, error: "User profile not found" };

    const message = await db.chatMessage.create({
      data: {
        channelId,
        senderEmail: dbUser.email,
        senderName: dbUser.name || dbUser.email,
        content: content.trim(),
      },
    });

    revalidatePath("/admin/chat");
    return { success: true, message };
  } catch (error: any) {
    console.error("sendChannelMessageAction error:", error);
    return { success: false, error: error.message || "Failed to send chat message" };
  }
}

export async function createChannelAction(name: string, isPrivate: boolean = false) {
  try {
    const user = await getCurrentUserAction();
    if (!user) return { success: false, error: "Unauthorized" };

    let channelName = name.trim().toLowerCase();
    if (!channelName.startsWith("#")) {
      channelName = `#${channelName}`;
    }

    // Replace spaces with hyphens
    channelName = channelName.replace(/\s+/g, "-");

    const existing = await db.chatChannel.findUnique({
      where: { name: channelName },
    });

    if (existing) {
      return { success: false, error: "A channel with this name already exists" };
    }

    const channel = await db.chatChannel.create({
      data: {
        name: channelName,
        isPrivate,
      },
    });

    revalidatePath("/admin/chat");
    return { success: true, channel };
  } catch (error: any) {
    console.error("createChannelAction error:", error);
    return { success: false, error: error.message || "Failed to create channel" };
  }
}
