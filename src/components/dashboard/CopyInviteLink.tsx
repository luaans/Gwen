"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CopyInviteLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/conhecendo/${token}`
      : `/conhecendo/${token}`;

  async function handleCopy() {
    const full =
      typeof window !== "undefined"
        ? `${window.location.origin}/conhecendo/${token}`
        : url;
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Link2 className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium">Convidar alguém a se apresentar</h3>
          <p className="mt-1 text-sm text-muted">
            Um único link. Várias pessoas. Cada resposta é um primeiro encontro.
          </p>
          <p className="mt-3 truncate rounded-xl bg-background/60 px-3 py-2 font-mono text-xs text-muted">
            /conhecendo/{token.slice(0, 8)}…
          </p>
          <div className="mt-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copiar link
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
