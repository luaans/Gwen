import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { NewPersonForm } from "@/components/people/NewPersonForm";

export default function NovaPessoaPage() {
  return (
    <AppShell title="Apresentar alguém">
      <PageTransition>
        <div className="mx-auto max-w-xl space-y-6">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-muted hover:text-accent"
            >
              ← Voltar
            </Link>
            <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
              Apresentar alguém para a Gwen
            </h1>
            <p className="mt-2 text-muted">
              Conte um pouco sobre essa pessoa. Depois, o formulário cuidará
              do primeiro encontro.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <NewPersonForm />
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
