"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import { createMemory, deleteMemory } from "@/services/memory.service";
import type { ActionResult } from "@/types";

export async function createMemoryAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireOwnerSession();
    const personId = String(formData.get("personId") || "");
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const importance = Number(formData.get("importance") || 5);

    if (!personId || title.length < 2 || content.length < 2) {
      return { success: false, error: "Preencha título e memória" };
    }

    const memory = await createMemory({
      personId,
      title,
      content,
      importance: Number.isFinite(importance) ? importance : 5,
    });

    revalidatePath(`/pessoas/${personId}`);
    return { success: true, data: { id: memory.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao guardar memória",
    };
  }
}

export async function deleteMemoryAction(
  id: string,
  personId: string,
): Promise<ActionResult> {
  try {
    await requireOwnerSession();
    await deleteMemory(id);
    revalidatePath(`/pessoas/${personId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao remover",
    };
  }
}
