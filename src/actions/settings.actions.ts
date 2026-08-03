"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import {
  getSettingsDTO,
  rotateInviteToken,
  updateOwnerDisplayName,
} from "@/services/settings.service";
import type { ActionResult } from "@/types";

export async function getSettingsAction() {
  await requireOwnerSession();
  return getSettingsDTO();
}

export async function rotateInviteTokenAction(): Promise<
  ActionResult<{ token: string }>
> {
  try {
    await requireOwnerSession();
    const token = await rotateInviteToken();
    revalidatePath("/dashboard");
    revalidatePath("/configuracoes");
    return { success: true, data: { token } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao regenerar",
    };
  }
}

export async function updateOwnerNameAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireOwnerSession();
    const name = String(formData.get("ownerDisplayName") || "").trim();
    if (name.length < 2) {
      return { success: false, error: "Informe um nome" };
    }
    await updateOwnerDisplayName(name);
    revalidatePath("/configuracoes");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao salvar",
    };
  }
}
