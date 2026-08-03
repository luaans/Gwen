"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPersonAction } from "@/actions/person.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { RELATION_LABELS } from "@/types";

const relationOptions = Object.entries(RELATION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function NewPersonForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createPersonAction(formData);
      if (!result.success || !result.data) {
        setError(result.error || "Não foi possível salvar");
        return;
      }
      router.push(`/pessoas/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <Input
        name="fullName"
        label="Nome completo"
        placeholder="Como essa pessoa se chama"
        required
      />
      <Input
        name="nickname"
        label="Apelido"
        placeholder="Opcional"
      />
      <Select
        name="relationType"
        label="Tipo de relação"
        defaultValue="amigo"
        options={relationOptions}
      />
      <Textarea
        name="notes"
        label="Observações"
        placeholder="Algo que a Gwen possa guardar logo de cara…"
      />
      {error ? (
        <p className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <Button type="submit" loading={pending} className="w-full sm:w-auto">
        Apresentar para a Gwen
      </Button>
    </form>
  );
}
