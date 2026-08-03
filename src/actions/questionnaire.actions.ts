"use server";

import { questionnaireSchema } from "@/lib/validations";
import {
  findExistingKnowing,
  findExistingKnowingByPersonId,
  submitQuestionnaire,
} from "@/services/questionnaire.service";
import { validateInviteToken } from "@/services/settings.service";
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

export async function checkKnowingByNameAction(
  token: string,
  fullName: string,
): Promise<
  ActionResult<{ alreadyDone: boolean; personId?: string; personName?: string }>
> {
  try {
    const valid = await validateInviteToken(token);
    if (!valid) {
      return { success: false, error: "Este convite não é mais válido." };
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      return { success: false, error: "Informe seu nome completo." };
    }

    const existing = await findExistingKnowing(fullName);
    if (existing) {
      return {
        success: true,
        data: {
          alreadyDone: true,
          personId: existing.personId,
          personName: existing.personName,
        },
      };
    }

    return { success: true, data: { alreadyDone: false } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível verificar",
    };
  }
}

export async function checkKnowingByPersonIdAction(
  token: string,
  personId: string,
): Promise<
  ActionResult<{ alreadyDone: boolean; personId?: string; personName?: string }>
> {
  try {
    const valid = await validateInviteToken(token);
    if (!valid) {
      return { success: false, error: "Este convite não é mais válido." };
    }

    const existing = await findExistingKnowingByPersonId(personId);
    if (existing) {
      return {
        success: true,
        data: {
          alreadyDone: true,
          personId: existing.personId,
          personName: existing.personName,
        },
      };
    }

    return { success: true, data: { alreadyDone: false } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível verificar",
    };
  }
}
