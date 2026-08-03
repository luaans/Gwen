import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative min-h-dvh overflow-hidden gwen-noise">
      <div className="pointer-events-none absolute inset-0 gwen-grid opacity-40" />
      <div className="relative mx-auto flex min-h-dvh max-w-5xl flex-col px-5 sm:px-8">
        <header className="flex h-16 items-center justify-between">
          <p className="font-[family-name:var(--font-fraunces)] text-xl tracking-tight">
            Gwen
          </p>
          {session ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Continuar
              </Button>
            </Link>
          ) : (
            <Link href="/entrar">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
          )}
        </header>

        <section className="flex flex-1 flex-col justify-center py-16 sm:py-24">
          <p className="mb-6 text-sm uppercase tracking-[0.2em] text-accent">
            Companion digital
          </p>
          <h1 className="max-w-3xl font-[family-name:var(--font-fraunces)] text-4xl leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            A melhor forma de conhecer alguém é ouvindo sua história.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
            A Gwen está aprendendo, uma pessoa de cada vez.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={session ? "/pessoas/nova" : "/entrar"}>
              <Button size="lg" className="w-full sm:w-auto">
                Apresentar alguém para a Gwen
              </Button>
            </Link>
            {session ? (
              <Link href="/dashboard">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Ver pessoas importantes
                </Button>
              </Link>
            ) : null}
          </div>
        </section>

        <footer className="pb-8 text-sm text-muted/70">
          Feita para uma única pessoa. Para muitas histórias.
        </footer>
      </div>
    </div>
  );
}
