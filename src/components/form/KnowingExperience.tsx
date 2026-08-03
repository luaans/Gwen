"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuestionnaireForm } from "@/components/form/QuestionnaireForm";

export function KnowingExperience({ token }: { token: string }) {
  const [started, setStarted] = useState(false);

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="flex min-h-[70dvh] flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Heart className="h-4 w-4 fill-current" />
              </span>
              <p className="font-[family-name:var(--font-fraunces)] text-xl tracking-tight text-accent">
                Gwen
              </p>
            </div>

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
                onClick={() => setStarted(true)}
              >
                Prosseguir
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Heart className="h-3.5 w-3.5 fill-current" />
              </span>
              <p className="font-[family-name:var(--font-fraunces)] text-lg tracking-tight">
                Gwen
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.06] bg-card/70 p-5 sm:p-6">
              <QuestionnaireForm token={token} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
