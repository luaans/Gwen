import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { MoodCheckIn } from "@/components/mood/MoodCheckIn";
import { listRecentMoods } from "@/services/mood.service";

export const dynamic = "force-dynamic";

export default async function HumorPage() {
  const recent = await listRecentMoods();

  return (
    <AppShell title="Humor">
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
              Humor
            </h1>
            <p className="mt-2 text-muted">
              Check-ins seus e sinais captados nas conversas.
            </p>
          </div>
          <MoodCheckIn recent={recent} />
        </div>
      </PageTransition>
    </AppShell>
  );
}
