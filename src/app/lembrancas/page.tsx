import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { RemindersList } from "@/components/reminders/RemindersList";
import { listOpenReminders } from "@/services/reminder.service";

export const dynamic = "force-dynamic";

export default async function LembrancasPage() {
  const reminders = await listOpenReminders();

  return (
    <AppShell title="Lembranças">
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
              Lembranças
            </h1>
            <p className="mt-2 text-muted">
              Coisas que a Gwen sugere lembrar, perguntar ou cuidar.
            </p>
          </div>
          <RemindersList reminders={reminders} />
        </div>
      </PageTransition>
    </AppShell>
  );
}
