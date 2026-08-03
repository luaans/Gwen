"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeReminderAction } from "@/actions/reminder.actions";
import { Button } from "@/components/ui/Button";
import type { ReminderDTO } from "@/types/dto";

export function PersonReminders({
  reminders,
}: {
  personId?: string;
  reminders: ReminderDTO[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium">Lembranças</h2>
        <Link
          href="/lembrancas"
          className="text-sm text-accent hover:text-accent-hover"
        >
          Ver todas
        </Link>
      </div>
      {reminders.length === 0 ? (
        <p className="mt-2 text-sm text-muted">
          Nada pendente para esta pessoa agora.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-white/[0.04] bg-background/40 px-3 py-3"
            >
              <div>
                <p className="text-sm font-medium">{reminder.title}</p>
                {reminder.reason ? (
                  <p className="mt-1 text-xs text-muted">{reminder.reason}</p>
                ) : null}
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                loading={pending}
                onClick={() =>
                  startTransition(async () => {
                    await completeReminderAction(reminder.id);
                    router.refresh();
                  })
                }
              >
                Feito
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
