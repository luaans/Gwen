import Link from "next/link";
import { Heart, Headphones, Sparkles, Users } from "lucide-react";
import { getOptionalSession } from "@/lib/session-safe";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const pillars = [
  {
    icon: Users,
    title: "Apresentar",
    description:
      "Apresente alguém importante. A Gwen guarda o começo dessa história com carinho.",
  },
  {
    icon: Headphones,
    title: "Ouvir",
    description:
      "O formulário é um primeiro encontro — respostas no ritmo de quem responde.",
  },
  {
    icon: Sparkles,
    title: "Lembrar",
    description:
      "Cada pessoa vira memória viva. A base para a companion crescer com o tempo.",
  },
];

export default async function HomePage() {
  const session = await getOptionalSession();

  return (
    <div className="relative min-h-dvh overflow-hidden gwen-noise">
      <div className="pointer-events-none absolute inset-0 gwen-grid opacity-30" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-32 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="group inline-flex cursor-pointer items-center gap-2.5"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent transition group-hover:scale-105">
              <Heart className="h-4 w-4 fill-current" />
            </span>
            <span className="font-[family-name:var(--font-fraunces)] text-xl tracking-tight sm:text-2xl">
              Gwen
            </span>
          </Link>

          {session ? (
            <Link href="/dashboard" className="cursor-pointer">
              <Button variant="secondary" size="sm">
                Continuar
              </Button>
            </Link>
          ) : (
            <Link href="/entrar" className="cursor-pointer">
              <Button variant="secondary" size="sm">
                Entrar
              </Button>
            </Link>
          )}
        </header>

        <section className="flex flex-1 flex-col justify-center py-10 sm:py-16 lg:py-20">
          <div className="mx-auto w-full max-w-3xl text-center lg:mx-0 lg:max-w-4xl lg:text-left">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-accent sm:text-sm">
              Companion digital
            </p>
            <h1 className="font-[family-name:var(--font-fraunces)] text-[2.35rem] leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              A melhor forma de conhecer alguém é ouvindo sua história.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:mt-6 sm:text-lg lg:mx-0 lg:text-xl">
              A Gwen está aprendendo, uma pessoa de cada vez.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href={session ? "/pessoas/nova" : "/entrar"}
                className="cursor-pointer"
              >
                <Button size="lg" className="w-full cursor-pointer sm:w-auto">
                  Apresentar alguém para a Gwen
                </Button>
              </Link>
              {session ? (
                <Link href="/dashboard" className="cursor-pointer">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full cursor-pointer sm:w-auto"
                  >
                    Ver pessoas importantes
                  </Button>
                </Link>
              ) : (
                <Link href="/entrar" className="cursor-pointer">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full cursor-pointer sm:w-auto"
                  >
                    Já sou o Luan
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-14 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:mt-20 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="rounded-[1.75rem] border border-border/80 bg-card/80 p-5 backdrop-blur-sm transition duration-300 hover:border-accent/35 hover:bg-card-elevated sm:p-6"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-xl tracking-tight">
                    {pillar.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="border-t border-border/50 py-6 text-center text-sm text-muted/70 sm:py-8 lg:text-left">
          Feita para uma única pessoa. Para muitas histórias.
        </footer>
      </div>
    </div>
  );
}
