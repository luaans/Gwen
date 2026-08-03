import Link from "next/link";
import { PageTransition } from "@/components/layout/PageTransition";

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string }>;
}) {
  const params = await searchParams;
  const nome = params.nome || "você";

  return (
    <div className="min-h-dvh gwen-noise">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-16 text-center">
        <PageTransition>
          <p className="font-[family-name:var(--font-fraunces)] text-xl text-accent">
            Gwen
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-fraunces)] text-4xl tracking-tight">
            Obrigada, {nome}
          </h1>
          <p className="mt-4 text-lg text-muted">
            Seu primeiro encontro foi guardado com carinho. A Gwen vai aprender
            com a sua história.
          </p>
          <Link
            href="/"
            className="mt-10 text-sm text-accent hover:text-accent-hover"
          >
            Voltar
          </Link>
        </PageTransition>
      </div>
    </div>
  );
}
