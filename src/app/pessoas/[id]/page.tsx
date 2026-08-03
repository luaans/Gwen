import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { getPersonById } from "@/services/person.service";
import { getQuestionnaireByPersonId } from "@/services/questionnaire.service";
import { RELATION_LABELS } from "@/types";
import { formatDate, formatRelative } from "@/utils/normalize";

export default async function PersonProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPersonById(id);
  if (!person) notFound();

  const questionnaire = await getQuestionnaireByPersonId(id);

  return (
    <AppShell title={person.fullName}>
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-8">
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-accent"
          >
            ← Pessoas importantes
          </Link>

          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Avatar name={person.fullName} src={person.photoUrl} size="xl" />
            <div className="flex-1">
              <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
                {person.fullName}
              </h1>
              <p className="mt-1 text-muted">
                {person.nickname
                  ? `${person.nickname} · ${RELATION_LABELS[person.relationType]}`
                  : RELATION_LABELS[person.relationType]}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/pessoas/${person.id}/editar`}>
                  <Button size="sm">Editar</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="text-sm text-muted">Primeiro encontro</p>
              <p className="mt-2 text-foreground">
                {formatDate(person.firstMetAt)}
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="text-sm text-muted">Última atualização</p>
              <p className="mt-2 text-foreground">
                {formatRelative(person.updatedAt)}
              </p>
            </div>
          </div>

          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-medium">Resumo</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {person.summary ||
                "Ainda sem resumo. Com o tempo, a Gwen vai tecer memórias aqui."}
            </p>
          </section>

          {person.notes ? (
            <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h2 className="font-medium">Observações suas</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                {person.notes}
              </p>
            </section>
          ) : null}

          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-medium">Primeiro encontro com a Gwen</h2>
            {questionnaire ? (
              <div className="mt-4 space-y-4 text-sm">
                <p className="text-muted">
                  Respondido em {formatDate(questionnaire.submittedAt)}
                </p>
                <div className="space-y-3">
                  <p>
                    <span className="text-muted">Prefere ser chamado: </span>
                    {questionnaire.whoYouAre?.preferredName}
                  </p>
                  <p>
                    <span className="text-muted">Como conheceu o Luan: </span>
                    {questionnaire.whoYouAre?.howMetLuan}
                  </p>
                  <p>
                    <span className="text-muted">Personalidade: </span>
                    {(questionnaire.personality?.description || []).join(", ") ||
                      "—"}
                  </p>
                  <p>
                    <span className="text-muted">Características: </span>
                    {(questionnaire.personality?.definingTraits || []).join(
                      ", ",
                    ) || "—"}
                  </p>
                  {questionnaire.forGwen?.neverForget ? (
                    <p>
                      <span className="text-muted">Nunca esquecer: </span>
                      {questionnaire.forGwen.neverForget}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">
                Ainda aguardando as respostas do formulário.
              </p>
            )}
          </section>
        </div>
      </PageTransition>
    </AppShell>
  );
}
