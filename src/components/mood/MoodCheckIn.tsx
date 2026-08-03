"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMoodAction } from "@/actions/mood.actions";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { MOOD_OPTIONS, type MoodDTO } from "@/types/mood";
import { cn } from "@/utils/cn";
import { formatRelative } from "@/utils/normalize";

export function MoodCheckIn({ recent }: { recent: MoodDTO[] }) {
  const router = useRouter();
  const [mood, setMood] = useState(MOOD_OPTIONS[1].value);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    formData.set("mood", mood);
    setMessage(null);
    startTransition(async () => {
      const result = await createMoodAction(formData);
      if (!result.success) {
        setMessage(result.error || "Não foi possível registrar");
        return;
      }
      setMessage("Humor guardado com carinho.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <form action={onSubmit} className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-[family-name:var(--font-fraunces)] text-xl tracking-tight">
          Como você está agora?
        </h2>
        <p className="mt-2 text-sm text-muted">
          A Gwen presta atenção no seu humor ao longo do tempo.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMood(option.value)}
              className={cn(
                "rounded-2xl border px-3 py-3 text-sm transition",
                mood === option.value
                  ? "border-accent/40 bg-accent-soft text-accent"
                  : "border-white/[0.06] text-muted hover:border-accent/20",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Textarea
            name="note"
            label="Quer contar um pouco mais?"
            placeholder="Opcional"
          />
        </div>
        <div className="mt-4">
          <Button type="submit" loading={pending}>
            Registrar humor
          </Button>
        </div>
        {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted">
          Últimos registros
        </h3>
        {recent.length === 0 ? (
          <p className="text-sm text-muted">Ainda sem check-ins.</p>
        ) : (
          recent.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-border bg-card px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium capitalize">{entry.mood}</p>
                <span className="text-xs text-muted">
                  {formatRelative(entry.createdAt)}
                </span>
              </div>
              {entry.note ? (
                <p className="mt-1 text-sm text-muted">{entry.note}</p>
              ) : null}
              <p className="mt-1 text-[11px] text-muted/70">
                origem: {entry.source} · score {entry.score}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
