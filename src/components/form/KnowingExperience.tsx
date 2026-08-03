"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { QuestionnaireForm } from "@/components/form/QuestionnaireForm";
import { FormThanksCard } from "@/components/form/FormThanksCard";
import {
  checkKnowingByNameAction,
  checkKnowingByPersonIdAction,
} from "@/actions/questionnaire.actions";

type Stage = "loading" | "intro" | "identify" | "form" | "thanks";

export function KnowingExperience({
  token,
  initialFeito,
}: {
  token: string;
  initialFeito?: string;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [personName, setPersonName] = useState<string | undefined>();
  const [prefillName, setPrefillName] = useState("");
  const [identifyError, setIdentifyError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!initialFeito) {
      setStage("intro");
      return;
    }

    startTransition(async () => {
      const result = await checkKnowingByPersonIdAction(token, initialFeito);
      if (result.success && result.data?.alreadyDone) {
        setPersonName(result.data.personName);
        setStage("thanks");
        return;
      }
      setStage("intro");
    });
  }, [initialFeito, token]);

  function goThanks(name: string, personId: string) {
    setPersonName(name);
    setStage("thanks");
    router.replace(`/conhecendo/${token}?feito=${personId}`, { scroll: false });
  }

  function handleIdentify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIdentifyError(null);
    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") || "").trim();

    startTransition(async () => {
      const result = await checkKnowingByNameAction(token, fullName);
      if (!result.success) {
        setIdentifyError(result.error || "Não foi possível continuar");
        return;
      }

      if (result.data?.alreadyDone && result.data.personId) {
        goThanks(result.data.personName || fullName, result.data.personId);
        return;
      }

      setPrefillName(fullName);
      setStage("form");
    });
  }

  function handleCompleted(personId: string, name: string) {
    goThanks(name, personId);
  }

  if (stage === "loading") {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-xl items-center justify-center px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <AnimatePresence mode="wait">
        {stage === "intro" ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="flex min-h-[70dvh] flex-col justify-center"
          >
            <Brand />
            <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-3xl tracking-tight sm:text-4xl">
              Conhecendo você para a Gwen
            </h1>
            <div className="mt-6 rounded-3xl border border-white/[0.06] bg-card/70 p-5 text-sm leading-relaxed text-muted sm:p-6">
              <p>Oi!</p>
              <p className="mt-3">
                Estou construindo um projeto muito especial chamado Gwen.
              </p>
              <p className="mt-3">
                A Gwen é uma amiga digital. Uma companheira criada para
                conhecer, aos poucos, as pessoas importantes da minha vida. Não
                é um chatbot frio: a ideia é que ela aprenda quem você é, no
                ritmo em que você se sentir à vontade para contar.
              </p>
              <p className="mt-3">
                Este formulário é o primeiro encontro entre você e a Gwen. Suas
                respostas ajudam ela a te entender melhor no futuro.
              </p>
              <p className="mt-3">
                Responda só o que fizer sentido compartilhar. Sem pressa e sem
                obrigação.
              </p>
              <p className="mt-3">Obrigado por fazer parte disso ❤️</p>
            </div>
            <div className="mt-8">
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={() => setStage("identify")}
              >
                Prosseguir
              </Button>
            </div>
          </motion.div>
        ) : null}

        {stage === "identify" ? (
          <motion.div
            key="identify"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="flex min-h-[70dvh] flex-col justify-center"
          >
            <Brand />
            <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
              Antes de começar
            </h1>
            <p className="mt-2 text-sm text-muted">
              Se você já respondeu antes, a Gwen reconhece pelo seu nome — em
              qualquer navegador — e te leva direto ao agradecimento.
            </p>
            <form
              onSubmit={handleIdentify}
              className="mt-6 space-y-5 rounded-3xl border border-white/[0.06] bg-card/70 p-5 sm:p-6"
            >
              <Input
                name="fullName"
                label="Seu nome completo"
                placeholder="Como está no documento"
                required
                autoFocus
              />
              {identifyError ? (
                <p className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {identifyError}
                </p>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => setStage("intro")}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  loading={pending}
                  className="w-full sm:ml-auto sm:w-auto"
                >
                  Continuar
                </Button>
              </div>
            </form>
          </motion.div>
        ) : null}

        {stage === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <Brand compact />
            </div>
            <div className="rounded-3xl border border-white/[0.06] bg-card/70 p-5 sm:p-6">
              <QuestionnaireForm
                token={token}
                prefillFullName={prefillName}
                onCompleted={handleCompleted}
              />
            </div>
          </motion.div>
        ) : null}

        {stage === "thanks" ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-[70dvh] flex-col justify-center"
          >
            <div className="mb-6">
              <Brand compact />
            </div>
            <FormThanksCard name={personName} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={
          compact
            ? "inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent"
            : "inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent"
        }
      >
        <Heart className={compact ? "h-3.5 w-3.5 fill-current" : "h-4 w-4 fill-current"} />
      </span>
      <p
        className={
          compact
            ? "font-[family-name:var(--font-fraunces)] text-lg tracking-tight"
            : "font-[family-name:var(--font-fraunces)] text-xl tracking-tight text-accent"
        }
      >
        Gwen
      </p>
    </div>
  );
}
