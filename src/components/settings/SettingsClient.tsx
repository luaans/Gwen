"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  rotateInviteTokenAction,
  rotateWidgetTokenAction,
  updateOwnerNameAction,
} from "@/actions/settings.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CopyInviteLink } from "@/components/dashboard/CopyInviteLink";

export function SettingsClient({
  ownerDisplayName,
  inviteToken,
  widgetToken,
}: {
  ownerDisplayName: string;
  inviteToken: string;
  widgetToken: string | null;
}) {
  const router = useRouter();
  const [token, setToken] = useState(inviteToken);
  const [widget, setWidget] = useState(widgetToken);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onName(formData: FormData) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await updateOwnerNameAction(formData);
      if (!result.success) {
        setError(result.error || "Falha ao salvar");
        return;
      }
      setMessage("Nome atualizado.");
      router.refresh();
    });
  }

  function onRotate() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await rotateInviteTokenAction();
      if (!result.success || !result.data) {
        setError(result.error || "Falha ao regenerar");
        return;
      }
      setToken(result.data.token);
      setMessage("Novo link de convite gerado.");
      router.refresh();
    });
  }

  function onRotateWidget() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await rotateWidgetTokenAction();
      if (!result.success || !result.data) {
        setError(result.error || "Falha ao gerar token");
        return;
      }
      setWidget(result.data.token);
      setMessage("Token do widget gerado. Cole-o no app Android.");
      router.refresh();
    });
  }

  async function copyWidgetToken() {
    if (!widget) return;
    await navigator.clipboard.writeText(widget);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <form action={onName} className="space-y-4 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-medium">Sobre você</h2>
        <Input
          name="ownerDisplayName"
          label="Como a Gwen te apresenta"
          defaultValue={ownerDisplayName}
          required
        />
        <Button type="submit" loading={pending} size="sm">
          Salvar
        </Button>
      </form>

      <div className="space-y-4">
        <CopyInviteLink token={token} />
        <Button
          type="button"
          variant="secondary"
          loading={pending}
          onClick={onRotate}
        >
          Gerar novo link de convite
        </Button>
        <p className="text-xs text-muted">
          Ao gerar um novo link, o anterior deixa de funcionar.
        </p>
      </div>

      <div className="space-y-4 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-medium">Widget Android</h2>
        <p className="text-sm text-muted">
          Gere um token e cole no widget na tela inicial. Com ele, a Gwen
          mostra seu humor e a próxima lembrança sem precisar abrir o app.
        </p>
        {widget ? (
          <div className="rounded-2xl border border-white/[0.06] bg-background/50 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-muted">Token</p>
            <p className="mt-1 break-all font-mono text-sm text-foreground">
              {widget}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Ainda sem token. Gere um para conectar o widget.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            loading={pending}
            onClick={onRotateWidget}
          >
            {widget ? "Gerar novo token" : "Gerar token"}
          </Button>
          {widget ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyWidgetToken}
            >
              {copied ? "Copiado" : "Copiar"}
            </Button>
          ) : null}
        </div>
        <p className="text-xs text-muted">
          Regenerar invalida o token antigo — o widget precisará ser
          reconfigurado.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 text-sm text-muted">
        <p className="font-medium text-foreground">Inteligência da Gwen</p>
        <p className="mt-2">
          Sem `OPENAI_API_KEY`, ela responde com base no perfil, formulário e
          memórias. Com a chave configurada no ambiente, ela conversa com IA de
          verdade.
        </p>
      </div>

      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
