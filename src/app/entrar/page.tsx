import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageTransition } from "@/components/layout/PageTransition";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-dvh gwen-noise">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-12">
        <PageTransition>
          <Link
            href="/"
            className="mb-10 inline-block font-[family-name:var(--font-fraunces)] text-2xl tracking-tight"
          >
            Gwen
          </Link>
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
            Olá, Luan
          </h1>
          <p className="mt-2 text-muted">
            Só você entra aqui. As histórias ficam protegidas.
          </p>
          <div className="mt-8 rounded-3xl border border-border bg-card p-6">
            <LoginForm />
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
