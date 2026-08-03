"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import { createMoodEntry } from "@/services/mood.service";
import type { MoodLabel } from "@/types/mood";
import type { ActionResult } from "@/types";

export async function createMoodAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireOwnerSession();
    const mood = String(formData.get("mood") || "") as MoodLabel;
    const note = String(formData.get("note") || "").trim();

    const allowed = [
      "radiante",
      "bem",
      "neutro",
      "cansado",
      "triste",
      "ansioso",
      "irritado",
    ];
    if (!allowed.includes(mood)) {
      return { success: false, error: "Escolha um humor" };
    }

    const entry = await createMoodEntry({
      mood,
      note,
      source: "owner",
    });

    revalidatePath("/dashboard");
    revalidatePath("/humor");
    return { success: true, data: { id: entry.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao registrar humor",
    };
  }
}
