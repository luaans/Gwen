"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { sendMessageAction } from "@/actions/conversation.actions";
import { Button } from "@/components/ui/Button";
import { useVoice } from "@/hooks/useVoice";
import type { ChatMessageDTO } from "@/types/dto";
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
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { supported, listening, speaking, listen, stopListening, speak, stopSpeaking } =
    useVoice();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  function send(content: string) {
    const text = content.trim();
    if (!text) return;
    setError(null);

    const optimisticOwner: ChatMessageDTO = {
      role: "owner",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimisticOwner]);
    setDraft("");

    startTransition(async () => {
      const result = await sendMessageAction(personId, text);
      if (!result.success || !result.data) {
        setError(result.error || "A Gwen não conseguiu responder agora");
        return;
      }
      setMessages(result.data.messages);
      const last = result.data.messages[result.data.messages.length - 1];
      if (voiceEnabled && last?.role === "gwen") {
        speak(last.content);
      }
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  return (
    <div className="flex h-[min(72dvh,720px)] flex-col rounded-3xl border border-border bg-card">
      <div className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div>
          <p className="text-sm text-muted">Conversando com a Gwen sobre</p>
          <p className="font-medium">{personName}</p>
        </div>
        {supported ? (
          <button
            type="button"
            onClick={() => {
              if (speaking) stopSpeaking();
              setVoiceEnabled((value) => !value);
            }}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] transition",
              voiceEnabled ? "text-accent" : "text-muted",
            )}
            aria-label={voiceEnabled ? "Desativar voz" : "Ativar voz"}
            title={voiceEnabled ? "Voz ligada" : "Voz desligada"}
          >
            {voiceEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        ) : null}
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

      <form onSubmit={onSubmit} className="border-t border-border/60 p-3 sm:p-4">
        {error ? <p className="mb-2 text-xs text-danger">{error}</p> : null}
        <div className="flex gap-2">
          {supported ? (
            <button
              type="button"
              onClick={() => {
                if (listening) {
                  stopListening();
                  return;
                }
                listen((text) => {
                  setDraft(text);
                  send(text);
                });
              }}
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] transition",
                listening ? "bg-accent text-[#0B0B0F]" : "text-muted hover:text-accent",
              )}
              aria-label={listening ? "Parar de ouvir" : "Falar"}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          ) : null}
          <input
            name="content"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={listening ? "Ouvindo…" : "Fale ou escreva para a Gwen…"}
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
