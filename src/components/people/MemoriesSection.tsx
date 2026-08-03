"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createMemoryAction,
  deleteMemoryAction,
} from "@/actions/memory.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { MemoryDTO } from "@/types/dto";
import { formatDate } from "@/utils/normalize";

export function MemoriesSection({
  personId,
  memories,
}: {
  personId: string;
  memories: MemoryDTO[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onCreate(formData: FormData) {
    setError(null);
    formData.set("personId", personId);
    startTransition(async () => {
      const result = await createMemoryAction(formData);
      if (!result.success) {
        setError(result.error || "Não foi possível guardar");
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium">Memórias</h2>
        <Button type="button" size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>
          {open ? "Fechar" : "Nova memória"}
        </Button>
      </div>

      {open ? (
        <form action={onCreate} className="mt-4 space-y-3">
          <Input name="title" label="Título" required />
          <Textarea name="content" label="O que lembrar" required />
          <Input
            name="importance"
            label="Importância (1-10)"
            type="number"
            min={1}
            max={10}
            defaultValue={5}
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" loading={pending} size="sm">
            Guardar memória
          </Button>
        </form>
      ) : null}

      <div className="mt-4 space-y-3">
        {memories.length === 0 ? (
          <p className="text-sm text-muted">
            Ainda não há memórias guardadas sobre esta pessoa.
          </p>
        ) : (
          memories.map((memory) => (
            <div
              key={memory.id}
              className="rounded-2xl border border-white/[0.05] bg-background/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{memory.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {memory.occurredAt
                      ? formatDate(memory.occurredAt)
                      : formatDate(memory.createdAt)}{" "}
                    · importância {memory.importance}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteMemoryAction(memory.id, personId);
                      router.refresh();
                    })
                  }
                >
                  Remover
                </Button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                {memory.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
