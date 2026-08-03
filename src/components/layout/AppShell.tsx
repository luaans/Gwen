"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/utils/cn";
import {
  Bell,
  BookHeart,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Smile,
  Settings,
  Users,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/conversas", label: "Conversas", icon: MessageCircle },
  { href: "/humor", label: "Humor", icon: Smile },
  { href: "/lembrancas", label: "Lembranças", icon: Bell },
  { href: "/diario", label: "Diário", icon: BookHeart },
  { href: "/pessoas/nova", label: "Apresentar", icon: Users },
  { href: "/configuracoes", label: "Ajustes", icon: Settings },
];

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh gwen-noise">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Heart className="h-4 w-4 fill-current" />
            </span>
            <span className="font-[family-name:var(--font-fraunces)] text-lg tracking-tight">
              Gwen
            </span>
          </Link>
          {title ? (
            <p className="hidden text-sm text-muted md:block">{title}</p>
          ) : null}
          <div className="hidden items-center gap-1 lg:flex">
            {links
              .filter((link) => link.href !== "/configuracoes")
              .map((link) => {
                const active =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm transition",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-muted hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            <Link
              href="/configuracoes"
              className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-foreground"
            >
              Ajustes
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-foreground lg:hidden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 pb-24 lg:pb-8">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-1">
          {links
            .filter((link) =>
              [
                "/dashboard",
                "/conversas",
                "/humor",
                "/lembrancas",
                "/diario",
              ].includes(link.href),
            )
            .map((link) => {
              const Icon = link.icon;
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-1.5 py-2 text-[10px] transition",
                    active ? "text-accent" : "text-muted",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
        </div>
      </nav>
    </div>
  );
}
