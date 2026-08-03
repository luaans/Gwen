"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import {
  getOrCreateConversation,
  sendCompanionMessage,
  sendConversationMessage,
} from "@/services/conversation.service";
import type { ActionResult } from "@/types";

export async function ensureConversationAction(personId: string) {
  await requireOwnerSession();
  return getOrCreateConversation(personId);
}

export async function sendMessageAction(
  personId: string,
  content: string,
): Promise<ActionResult<{ messages: Awaited<ReturnType<typeof sendConversationMessage>>["messages"] }>> {
  try {
    await requireOwnerSession();
    if (!content.trim()) {
      return { success: false, error: "Escreva algo para a Gwen" };
    }
    const conversation = await sendConversationMessage(personId, content);
    revalidatePath(`/pessoas/${personId}/conversa`);
    revalidatePath("/conversas");
    return { success: true, data: { messages: conversation.messages } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha na conversa",
    };
  }
}

export async function sendCompanionMessageAction(
  content: string,
): Promise<
  ActionResult<{
    messages: Awaited<ReturnType<typeof sendCompanionMessage>>["messages"];
  }>
> {
  try {
    await requireOwnerSession();
    if (!content.trim()) {
      return { success: false, error: "Fale ou escreva algo para a Gwen" };
    }
    const conversation = await sendCompanionMessage(content);
    revalidatePath("/conversar");
    revalidatePath("/conversas");
    revalidatePath("/humor");
    return { success: true, data: { messages: conversation.messages } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha na conversa",
    };
  }
}
