import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { listRecentConversations } from "@/services/conversation.service";
import { formatRelative } from "@/utils/normalize";

export const dynamic = "force-dynamic";

export default async function ConversasPage() {
  const conversations = await listRecentConversations();

  return (
    <AppShell title="Sobre alguém">
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
                Sobre alguém
              </h1>
              <p className="mt-2 text-muted">
                Conversas com a Gwen sobre as pessoas importantes da sua vida.
              </p>
            </div>
            <Link href="/conversar">
              <Button className="w-full sm:w-auto">Falar com a Gwen</Button>
            </Link>
          </div>

          <Link
            href="/conversar"
            className="block rounded-3xl border border-accent/30 bg-accent-soft/40 p-5 transition hover:border-accent/50"
          >
            <p className="text-sm text-accent">Companion</p>
            <h2 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl tracking-tight">
              Conversar com a Gwen
            </h2>
            <p className="mt-2 text-sm text-muted">
              Modo voz — ela escuta e responde falando, como uma amiga.
            </p>
          </Link>

          {conversations.length === 0 ? (
            <EmptyState
              title="Ainda sem conversas sobre alguém"
              description="Abra o perfil de uma pessoa e comece a conversar com a Gwen sobre ela."
              action={
                <Link href="/dashboard">
                  <Button variant="secondary">Ver pessoas</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {conversations.map((item) => (
                <Link
                  key={item.id}
                  href={`/pessoas/${item.personId}/conversa`}
                  className="block rounded-3xl border border-border bg-card p-4 transition hover:border-accent/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-medium">{item.personName}</h2>
                    <span className="text-xs text-muted">
                      {formatRelative(item.updatedAt)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {item.preview || "Conversa começando…"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
