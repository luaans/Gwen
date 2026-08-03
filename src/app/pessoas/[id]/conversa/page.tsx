import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { ChatClient } from "@/components/chat/ChatClient";
import { getPersonById } from "@/services/person.service";
import { getOrCreateConversation } from "@/services/conversation.service";

export const dynamic = "force-dynamic";

export default async function ConversaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPersonById(id);
  if (!person) notFound();

  const conversation = await getOrCreateConversation(id);

  return (
    <AppShell title={`Gwen · ${person.nickname || person.fullName}`}>
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-4">
          <Link
            href={`/pessoas/${person.id}`}
            className="text-sm text-muted hover:text-accent"
          >
            ← Voltar ao perfil
          </Link>
          <ChatClient
            personId={person.id}
            personName={person.nickname || person.fullName}
            initialMessages={conversation.messages}
          />
        </div>
      </PageTransition>
    </AppShell>
  );
}
