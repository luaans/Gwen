"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Mic, MicOff } from "lucide-react";
import { sendCompanionMessageAction } from "@/actions/conversation.actions";
import { useVoice } from "@/hooks/useVoice";
import type { ChatMessageDTO } from "@/services/conversation.service";
import { cn } from "@/utils/cn";

export function CompanionVoiceClient({
  initialMessages,
}: {
  initialMessages: ChatMessageDTO[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "listening" | "thinking" | "speaking"
  >("idle");
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const sessionActiveRef = useRef(false);
  const busyRef = useRef(false);
  const listenAgainRef = useRef<() => void>(() => undefined);

  const {
    supported,
    listening,
    speaking,
    listen,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice();

  useEffect(() => {
    sessionActiveRef.current = sessionActive;
  }, [sessionActive]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending, status]);

  const startListeningSafe = useCallback(() => {
    if (!supported || busyRef.current) return;
    setError(null);
    setStatus("listening");
    const started = listen((text) => {
      sendVoiceRef.current(text);
    });
    if (!started) {
      setStatus("idle");
      setError("Não consegui acessar o microfone. Toque de novo para tentar.");
    }
  }, [supported, listen]);

  const sendVoiceRef = useRef<(content: string) => void>(() => undefined);

  const sendVoice = useCallback(
    (content: string) => {
      const text = content.trim();
      if (!text || busyRef.current) return;

      busyRef.current = true;
      stopListening();
      setError(null);
      setDraft("");
      setStatus("thinking");

      setMessages((current) => [
        ...current,
        {
          role: "owner",
          content: text,
          createdAt: new Date().toISOString(),
        },
      ]);

      startTransition(async () => {
        const result = await sendCompanionMessageAction(text);
        if (!result.success || !result.data) {
          setError(result.error || "A Gwen não conseguiu responder agora");
          busyRef.current = false;
          setStatus("idle");
          if (sessionActiveRef.current) {
            window.setTimeout(() => listenAgainRef.current(), 500);
          }
          return;
        }

        setMessages(result.data.messages);
        const last = result.data.messages[result.data.messages.length - 1];

        if (last?.role === "gwen") {
          setStatus("speaking");
          speak(last.content, {
            onEnd: () => {
              busyRef.current = false;
              if (sessionActiveRef.current) {
                listenAgainRef.current();
              } else {
                setStatus("idle");
              }
            },
          });
        } else {
          busyRef.current = false;
          setStatus("idle");
        }
      });
    },
    [speak, stopListening],
  );

  useEffect(() => {
    sendVoiceRef.current = sendVoice;
  }, [sendVoice]);

  useEffect(() => {
    listenAgainRef.current = startListeningSafe;
  }, [startListeningSafe]);

  function startSession() {
    setSessionActive(true);
    sessionActiveRef.current = true;
    stopSpeaking();
    startListeningSafe();
  }

  function stopSession() {
    setSessionActive(false);
    sessionActiveRef.current = false;
    busyRef.current = false;
    stopListening();
    stopSpeaking();
    setStatus("idle");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sessionActive) {
      setSessionActive(true);
      sessionActiveRef.current = true;
    }
    sendVoice(draft);
  }

  const statusLabel =
    status === "listening"
      ? "Ouvindo…"
      : status === "thinking"
        ? "Pensando…"
        : status === "speaking"
          ? "Falando…"
          : sessionActive
            ? "Pronta — toque para continuar"
            : "Toque para falar comigo";

  return (
    <div className="flex min-h-[min(78dvh,820px)] flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 text-center">
        <p className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight sm:text-4xl">
          Gwen
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Sua companion. Fale normalmente — eu escuto e respondo em voz.
        </p>

        <button
          type="button"
          onClick={() => {
            if (sessionActive && (listening || speaking || pending)) {
              stopSession();
              return;
            }
            if (sessionActive && status === "idle") {
              startListeningSafe();
              return;
            }
            startSession();
          }}
          className={cn(
            "relative mt-10 flex h-36 w-36 items-center justify-center rounded-full transition",
            "border border-accent/30 bg-accent-soft shadow-[0_0_60px_rgba(245,163,199,0.18)]",
            (listening || speaking) && "scale-105 border-accent/60",
            pending && "opacity-80",
          )}
          aria-label={sessionActive ? "Parar ou continuar" : "Começar a falar"}
        >
          {(listening || speaking) && (
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
          )}
          {listening ? (
            <MicOff className="relative h-10 w-10 text-accent" />
          ) : (
            <Mic className="relative h-10 w-10 text-accent" />
          )}
        </button>

        <p className="mt-6 text-sm font-medium text-accent">{statusLabel}</p>
        {!supported ? (
          <p className="mt-2 max-w-sm text-xs text-muted">
            Este navegador não libera microfone/voz. No app Android ou no Chrome
            funciona melhor.
          </p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </div>

      <div className="mx-auto w-full max-w-xl space-y-2 px-4 pb-3">
        <div className="max-h-40 space-y-2 overflow-y-auto rounded-3xl border border-border/60 bg-card/60 p-3">
          {messages.slice(-4).map((message, index) => (
            <div
              key={`${message.createdAt}-${index}`}
              className={cn(
                "rounded-2xl px-3 py-2 text-left text-sm leading-relaxed",
                message.role === "owner"
                  ? "ml-8 bg-accent text-[#0B0B0F]"
                  : "mr-8 bg-background/70 text-foreground",
              )}
            >
              {message.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ou escreva se preferir…"
            className="h-11 flex-1 rounded-2xl border border-white/[0.06] bg-card px-4 text-sm outline-none focus:border-accent/40"
            disabled={pending}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={pending || !draft.trim()}
            className="h-11 rounded-2xl bg-accent px-4 text-sm font-medium text-[#0B0B0F] disabled:opacity-50"
          >
            Enviar
          </button>
        </form>

        {sessionActive ? (
          <button
            type="button"
            onClick={stopSession}
            className="w-full py-2 text-xs text-muted hover:text-accent"
          >
            Encerrar modo voz
          </button>
        ) : null}
      </div>
    </div>
  );
}
