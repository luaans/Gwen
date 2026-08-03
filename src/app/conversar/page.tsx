import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { CompanionVoiceClient } from "@/components/chat/CompanionVoiceClient";
import { getOrCreateCompanionConversation } from "@/services/conversation.service";

export const dynamic = "force-dynamic";

export default async function ConversarPage() {
  const conversation = await getOrCreateCompanionConversation();

  return (
    <AppShell title="Com a Gwen">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <p className="text-sm text-muted">Conversa direta</p>
          <Link
            href="/conversas"
            className="text-sm text-accent hover:text-accent-hover"
          >
            Sobre alguém →
          </Link>
        </div>
        <CompanionVoiceClient initialMessages={conversation.messages} />
      </div>
    </AppShell>
  );
}
