"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updatePersonAction,
  uploadPersonPhotoAction,
} from "@/actions/person.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar } from "@/components/ui/Avatar";
import { RELATION_LABELS, type PersonDTO } from "@/types";

const relationOptions = Object.entries(RELATION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function EditPersonForm({ person }: { person: PersonDTO }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [photoPending, startPhotoTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    setMessage(null);
    formData.set("id", person.id);
    startTransition(async () => {
      const result = await updatePersonAction(formData);
      if (!result.success) {
        setError(result.error || "Não foi possível atualizar");
        return;
      }
      setMessage("História atualizada com cuidado.");
      router.refresh();
    });
  }

  function onPhoto(formData: FormData) {
    setError(null);
    setMessage(null);
    formData.set("id", person.id);
    startPhotoTransition(async () => {
      const result = await uploadPersonPhotoAction(formData);
      if (!result.success) {
        setError(result.error || "Falha ao enviar foto");
        return;
      }
      setMessage("Foto adicionada.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <form action={onPhoto} className="rounded-3xl border border-border bg-card p-5">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar name={person.fullName} src={person.photoUrl} size="xl" />
          <div className="flex-1 space-y-3">
            <p className="text-sm text-muted">
              Só você pode adicionar a foto desta pessoa.
            </p>
            <Input
              name="photo"
              label="Foto"
              type="file"
              accept="image/*"
            />
            <Button type="submit" variant="secondary" loading={photoPending} size="sm">
              Guardar foto
            </Button>
          </div>
        </div>
      </form>

      <form action={onSubmit} className="space-y-5">
        <Input
          name="fullName"
          label="Nome completo"
          defaultValue={person.fullName}
          required
        />
        <Input
          name="nickname"
          label="Apelido"
          defaultValue={person.nickname || ""}
        />
        <Select
          name="relationType"
          label="Tipo de relação"
          defaultValue={person.relationType}
          options={relationOptions}
        />
        <Textarea
          name="notes"
          label="Observações"
          defaultValue={person.notes || ""}
        />
        {error ? (
          <p className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            {message}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={pending}>
            Salvar mudanças
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/pessoas/${person.id}`)}
          >
            Voltar
          </Button>
        </div>
      </form>
    </div>
  );
}
