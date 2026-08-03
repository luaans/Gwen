import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { JournalClient } from "@/components/journal/JournalClient";
import { listJournalEntries } from "@/services/journal.service";

export const dynamic = "force-dynamic";

export default async function DiarioPage() {
  const entries = await listJournalEntries();

  return (
    <AppShell title="Diário">
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
              Diário
            </h1>
            <p className="mt-2 text-muted">
              Acontecimentos importantes da sua vida. A Gwen vai aprender com
              o tempo.
            </p>
          </div>
          <JournalClient entries={entries} />
        </div>
      </PageTransition>
    </AppShell>
  );
}
