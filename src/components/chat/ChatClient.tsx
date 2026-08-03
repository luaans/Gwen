"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { sendMessageAction } from "@/actions/conversation.actions";
import { Button } from "@/components/ui/Button";
import type { ChatMessageDTO } from "@/services/conversation.service";
import { cn } from "@/utils/cn";

export function ChatClient({
  personId,
  personName,
  initialMessages,
}: {
  personId: string;
  personName: string;
  initialMessages: ChatMessageDTO[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = String(formData.get("content") || "").trim();
    if (!content) return;

    const optimisticOwner: ChatMessageDTO = {
      role: "owner",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimisticOwner]);
    form.reset();

    startTransition(async () => {
      const result = await sendMessageAction(personId, content);
      if (!result.success || !result.data) {
        setError(result.error || "A Gwen não conseguiu responder agora");
        return;
      }
      setMessages(result.data.messages);
    });
  }

  return (
    <div className="flex h-[min(72dvh,720px)] flex-col rounded-3xl border border-border bg-card">
      <div className="border-b border-border/60 px-4 py-3">
        <p className="text-sm text-muted">Conversando com a Gwen sobre</p>
        <p className="font-medium">{personName}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => (
          <div
            key={`${message.createdAt}-${index}`}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              message.role === "owner"
                ? "ml-auto bg-accent text-[#0B0B0F]"
                : "bg-background/70 text-foreground",
            )}
          >
            {message.content}
          </div>
        ))}
        {pending ? (
          <div className="max-w-[85%] rounded-2xl bg-background/70 px-4 py-3 text-sm text-muted">
            Gwen está pensando…
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-border/60 p-3 sm:p-4"
      >
        {error ? (
          <p className="mb-2 text-xs text-danger">{error}</p>
        ) : null}
        <div className="flex gap-2">
          <input
            name="content"
            placeholder="Fale com a Gwen…"
            className="h-11 flex-1 rounded-2xl border border-white/[0.06] bg-background/60 px-4 text-sm outline-none focus:border-accent/40"
            disabled={pending}
            autoComplete="off"
          />
          <Button type="submit" loading={pending}>
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
