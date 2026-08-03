"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import {
  completeReminder,
  createReminder,
  syncRemindersForPerson,
} from "@/services/reminder.service";
import type { ActionResult } from "@/types";

export async function completeReminderAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireOwnerSession();
    await completeReminder(id);
    revalidatePath("/dashboard");
    revalidatePath("/lembrancas");
    revalidatePath("/pessoas");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao concluir",
    };
  }
}

export async function createReminderAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireOwnerSession();
    const title = String(formData.get("title") || "").trim();
    const reason = String(formData.get("reason") || "").trim();
    const personId = String(formData.get("personId") || "").trim();

    if (title.length < 2) {
      return { success: false, error: "Dê um título ao lembrete" };
    }

    const reminder = await createReminder({
      title,
      reason,
      personId: personId || undefined,
    });

    revalidatePath("/dashboard");
    revalidatePath("/lembrancas");
    return { success: true, data: { id: reminder.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao criar",
    };
  }
}

export async function syncPersonRemindersAction(
  personId: string,
): Promise<ActionResult> {
  try {
    await requireOwnerSession();
    await syncRemindersForPerson(personId);
    revalidatePath(`/pessoas/${personId}`);
    revalidatePath("/lembrancas");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao sincronizar",
    };
  }
}
