"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createJournalAction, deleteJournalAction } from "@/actions/journal.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { JournalDTO } from "@/types/dto";
import { formatDate } from "@/utils/normalize";

export function JournalClient({ entries }: { entries: JournalDTO[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createJournalAction(formData);
      if (!result.success) {
        setError(result.error || "Não foi possível guardar");
        return;
      }
      router.refresh();
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      await deleteJournalAction(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <form action={onCreate} className="space-y-4 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-[family-name:var(--font-fraunces)] text-xl tracking-tight">
          Novo acontecimento
        </h2>
        <Input name="title" label="Título" placeholder="O que aconteceu?" required />
        <Textarea
          name="body"
          label="Detalhes"
          placeholder="Conte um pouco mais, se quiser…"
        />
        <Input
          name="tags"
          label="Tags"
          placeholder="marco, amizade, gwen"
          hint="Separe por vírgula"
        />
        {error ? (
          <p className="text-sm text-danger">{error}</p>
        ) : null}
        <Button type="submit" loading={pending}>
          Guardar no diário
        </Button>
      </form>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-muted">O diário ainda está quieto.</p>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-3xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{entry.title}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {formatDate(entry.occurredAt)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(entry.id)}
                >
                  Remover
                </Button>
              </div>
              {entry.body ? (
                <p className="mt-3 whitespace-pre-wrap text-sm text-muted">
                  {entry.body}
                </p>
              ) : null}
              {entry.tags.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
