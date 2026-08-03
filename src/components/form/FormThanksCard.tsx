import { Heart } from "lucide-react";

export function FormThanksCard({
  name,
}: {
  name?: string;
}) {
  return (
    <div className="rounded-3xl border border-accent/20 bg-accent-soft/50 p-5 sm:p-6">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
        <Heart className="h-4 w-4 fill-current" />
      </span>
      <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-2xl tracking-tight text-foreground">
        {name ? `Obrigada, ${name}` : "Obrigada"}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Seu primeiro encontro com a Gwen foi recebido com carinho. Suas
        respostas ajudam ela a te conhecer melhor, no seu tempo.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Se você abrir este mesmo link de novo — em qualquer navegador — e
        informar o mesmo nome completo, a Gwen te traz de volta para cá.
      </p>
    </div>
  );
}

export function formDoneStorageKey(token: string) {
  return `gwen:knowing-done:${token}`;
}
