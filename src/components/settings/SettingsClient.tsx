"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  rotateInviteTokenAction,
  updateOwnerNameAction,
} from "@/actions/settings.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CopyInviteLink } from "@/components/dashboard/CopyInviteLink";

export function SettingsClient({
  ownerDisplayName,
  inviteToken,
}: {
  ownerDisplayName: string;
  inviteToken: string;
}) {
  const router = useRouter();
  const [token, setToken] = useState(inviteToken);
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
