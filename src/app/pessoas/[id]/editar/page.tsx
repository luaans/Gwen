import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { EditPersonForm } from "@/components/people/EditPersonForm";
import { getPersonById } from "@/services/person.service";

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPersonById(id);
  if (!person) notFound();

  return (
    <AppShell title={`Editar · ${person.fullName}`}>
      <PageTransition>
        <div className="mx-auto max-w-xl space-y-6">
          <div>
            <Link
              href={`/pessoas/${person.id}`}
              className="text-sm text-muted hover:text-accent"
            >
              ← Voltar ao perfil
            </Link>
            <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
              Editar história
            </h1>
            <p className="mt-2 text-muted">
              Ajuste o que a Gwen já sabe sobre {person.nickname || person.fullName}.
            </p>
          </div>
          <EditPersonForm person={person} />
        </div>
      </PageTransition>
    </AppShell>
  );
}
