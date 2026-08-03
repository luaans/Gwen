"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateSummaryAction } from "@/actions/summary.actions";
import { Button } from "@/components/ui/Button";

export function GenerateSummaryButton({ personId }: { personId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          await generateSummaryAction(personId);
          router.refresh();
        })
      }
    >
      Atualizar resumo
    </Button>
  );
}
