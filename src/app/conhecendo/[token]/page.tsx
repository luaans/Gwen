import { notFound } from "next/navigation";
import { validateInviteToken } from "@/services/settings.service";
import { QuestionnaireForm } from "@/components/form/QuestionnaireForm";
import { PageTransition } from "@/components/layout/PageTransition";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const valid = await validateInviteToken(token);

  if (!valid) {
    notFound();
  }

  return (
    <div className="min-h-dvh gwen-noise">
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
        <PageTransition>
          <p className="font-[family-name:var(--font-fraunces)] text-xl tracking-tight text-accent">
            Gwen
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl tracking-tight sm:text-4xl">
            Conhecendo você para a Gwen
          </h1>
          <div className="mt-6 rounded-3xl border border-border bg-card p-5 text-sm leading-relaxed text-muted sm:p-6">
            <p>Oi!</p>
            <p className="mt-3">
              Estou construindo um projeto muito especial chamado Gwen.
            </p>
            <p className="mt-3">
              Ela é uma companion digital criada para conhecer as pessoas
              importantes da minha vida.
            </p>
            <p className="mt-3">
              Este formulário representa o primeiro encontro entre você e a
              Gwen.
            </p>
            <p className="mt-3">
              Responda apenas aquilo que se sentir confortável em compartilhar.
            </p>
            <p className="mt-3">
              Obrigado por fazer parte desse projeto ❤️
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-card p-5 sm:p-6">
            <QuestionnaireForm token={token} />
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
