import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { CopyInviteLink } from "@/components/dashboard/CopyInviteLink";
import { PeopleSearch } from "@/components/dashboard/PeopleSearch";
import { PersonCard } from "@/components/people/PersonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDashboardData } from "@/services/dashboard.service";
import { formatRelative } from "@/utils/normalize";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const data = await getDashboardData(params.q);

  return (
    <AppShell title="Pessoas importantes">
      <PageTransition>
        <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight sm:text-4xl">
                Pessoas importantes
              </h1>
              <p className="mt-2 text-muted">
                Cada nome aqui é uma história em construção.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Link href="/conversas">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Conversas
                </Button>
              </Link>
              <Link href="/pessoas/nova">
                <Button className="w-full sm:w-auto">
                  Apresentar alguém
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="text-sm text-muted">Pessoas</p>
              <p className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl text-accent">
                {data.peopleCount}
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 sm:col-span-2">
              <p className="text-sm text-muted">Últimos primeiros encontros</p>
              <ul className="mt-3 space-y-2">
                {data.recentQuestionnaires.length === 0 ? (
                  <li className="text-sm text-muted">
                    Ainda ninguém respondeu o formulário.
                  </li>
                ) : (
                  data.recentQuestionnaires.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <Link
                        href={`/pessoas/${item.personId}`}
                        className="truncate text-foreground hover:text-accent"
                      >
                        {item.personName}
                      </Link>
                      <span className="shrink-0 text-muted">
                        {formatRelative(item.submittedAt)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <CopyInviteLink token={data.inviteToken} />

          <Suspense fallback={<Skeleton className="h-12 w-full" />}>
            <PeopleSearch defaultValue={params.q || ""} />
          </Suspense>

          <section className="space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
              Todas as pessoas
            </h2>
            {data.people.length === 0 ? (
              <EmptyState
                title="Ainda está quieto por aqui"
                description="Apresente alguém para a Gwen — ou compartilhe o link do primeiro encontro."
                action={
                  <Link href="/pessoas/nova">
                    <Button>Apresentar alguém</Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-3">
                {data.people.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            )}
          </section>
        </div>
      </PageTransition>
    </AppShell>
  );
}
