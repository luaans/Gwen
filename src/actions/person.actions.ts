"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/session";
import { createPersonSchema, updatePersonSchema } from "@/lib/validations";
import {
  createPerson,
  getPersonById,
  updatePerson,
} from "@/services/person.service";
import type { ActionResult, PersonDTO } from "@/types";

export async function createPersonAction(
  formData: FormData,
): Promise<ActionResult<PersonDTO>> {
  try {
    await requireOwnerSession();

    const parsed = createPersonSchema.safeParse({
      fullName: formData.get("fullName"),
      nickname: formData.get("nickname") || undefined,
      relationType: formData.get("relationType"),
      notes: formData.get("notes") || undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Dados inválidos",
      };
    }

    const person = await createPerson(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/pessoas/nova");
    return { success: true, data: person };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Algo deu errado",
    };
  }
}

export async function updatePersonAction(
  formData: FormData,
): Promise<ActionResult<PersonDTO>> {
  try {
    await requireOwnerSession();

    const id = String(formData.get("id") || "");
    const parsed = updatePersonSchema.safeParse({
      id,
      fullName: formData.get("fullName") || undefined,
      nickname: formData.get("nickname") || undefined,
      relationType: formData.get("relationType") || undefined,
      notes: formData.get("notes") || undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Dados inválidos",
      };
    }

    const { id: personId, ...rest } = parsed.data;
    const person = await updatePerson(personId, rest);
    if (!person) {
      return { success: false, error: "Pessoa não encontrada" };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/pessoas/${personId}`);
    revalidatePath(`/pessoas/${personId}/editar`);
    return { success: true, data: person };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Algo deu errado",
    };
  }
}

export async function uploadPersonPhotoAction(
  formData: FormData,
): Promise<ActionResult<PersonDTO>> {
  try {
    await requireOwnerSession();

    const id = String(formData.get("id") || "");
    const file = formData.get("photo");

    if (!id) {
      return { success: false, error: "Pessoa não informada" };
    }

    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Escolha uma foto" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Arquivo precisa ser uma imagem" };
    }

    const existing = await getPersonById(id);
    if (!existing) {
      return { success: false, error: "Pessoa não encontrada" };
    }

    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads", "people");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${id}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const photoUrl = `/uploads/people/${filename}`;
    const person = await updatePerson(id, { photoUrl });

    revalidatePath("/dashboard");
    revalidatePath(`/pessoas/${id}`);
    revalidatePath(`/pessoas/${id}/editar`);

    return { success: true, data: person || undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha no upload",
    };
  }
}
