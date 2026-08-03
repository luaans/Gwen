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
    <AppShell title="Conversas">
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
              Conversas
            </h1>
            <p className="mt-2 text-muted">
              Fale com a Gwen sobre as pessoas importantes da sua vida.
            </p>
          </div>

          {conversations.length === 0 ? (
            <EmptyState
              title="Ainda sem conversas"
              description="Abra o perfil de alguém e comece a conversar com a Gwen."
              action={
                <Link href="/dashboard">
                  <Button>Ver pessoas</Button>
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
