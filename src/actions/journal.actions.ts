"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import {
  createJournalEntry,
  deleteJournalEntry,
} from "@/services/journal.service";
import type { ActionResult } from "@/types";

export async function createJournalAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireOwnerSession();
    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const tags = String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (title.length < 2) {
      return { success: false, error: "Dê um título a este acontecimento" };
    }

    const entry = await createJournalEntry({ title, body, tags });
    revalidatePath("/diario");
    revalidatePath("/dashboard");
    return { success: true, data: { id: entry.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao guardar",
    };
  }
}

export async function deleteJournalAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireOwnerSession();
    await deleteJournalEntry(id);
    revalidatePath("/diario");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao remover",
    };
  }
}
