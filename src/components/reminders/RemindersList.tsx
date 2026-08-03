"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeReminderAction } from "@/actions/reminder.actions";
import { Button } from "@/components/ui/Button";
import type { ReminderDTO } from "@/services/reminder.service";

export function RemindersList({ reminders }: { reminders: ReminderDTO[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (reminders.length === 0) {
    return (
      <p className="text-sm text-muted">
        Nenhuma lembrança aberta agora. A Gwen cria algumas a partir dos
        formulários e das lacunas.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => (
        <article
          key={reminder.id}
          className="rounded-3xl border border-border bg-card p-4 sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-medium">{reminder.title}</h3>
              {reminder.reason ? (
                <p className="mt-1 text-sm text-muted">{reminder.reason}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                {reminder.personName ? (
                  <Link
                    href={`/pessoas/${reminder.personId}`}
                    className="text-accent hover:text-accent-hover"
                  >
                    {reminder.personName}
                  </Link>
                ) : null}
                <span>prioridade {reminder.priority}</span>
              </div>
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
          </div>
        </article>
      ))}
    </div>
  );
}
