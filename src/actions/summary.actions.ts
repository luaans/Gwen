"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import { generatePersonSummary } from "@/services/summary.service";
import type { ActionResult } from "@/types";

export async function generateSummaryAction(
  personId: string,
): Promise<ActionResult<{ content: string }>> {
  try {
    await requireOwnerSession();
    const summary = await generatePersonSummary(personId, "manual");
    revalidatePath(`/pessoas/${personId}`);
    revalidatePath("/dashboard");
    return { success: true, data: { content: summary.content } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao gerar resumo",
    };
  }
}
