"use server";

import { questionnaireSchema } from "@/lib/validations";
import { submitQuestionnaire } from "@/services/questionnaire.service";
import type { ActionResult } from "@/types";

export async function submitQuestionnaireAction(
  token: string,
  raw: unknown,
): Promise<ActionResult<{ personId: string; personName: string }>> {
  try {
    const parsed = questionnaireSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Revise as respostas",
      };
    }

    const result = await submitQuestionnaire(token, parsed.data);
    return {
      success: true,
      data: {
        personId: result.personId,
        personName: result.personName,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível salvar",
    };
  }
}
