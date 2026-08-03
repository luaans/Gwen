import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center gwen-noise">
      <p className="font-[family-name:var(--font-fraunces)] text-xl text-accent">
        Gwen
      </p>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
        Essa página não existe
      </h1>
      <p className="max-w-sm text-muted">
        Talvez o link tenha expirado, ou essa história ainda não exista.
      </p>
      <Link href="/" className="text-sm text-accent hover:text-accent-hover">
        Voltar ao início
      </Link>
    </div>
  );
}
