import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { RELATION_LABELS, type PersonDTO } from "@/types";
import { formatDate, formatRelative } from "@/utils/normalize";

export function PersonCard({ person }: { person: PersonDTO }) {
  return (
    <Link
      href={`/pessoas/${person.id}`}
      className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-4 transition duration-200 hover:border-accent/30 hover:bg-card-elevated"
    >
      <Avatar
        name={person.fullName}
        src={person.photoUrl}
        size="lg"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-medium text-foreground group-hover:text-accent transition-colors">
              {person.fullName}
            </h3>
            <p className="truncate text-sm text-muted">
              {person.nickname
                ? `${person.nickname} · ${RELATION_LABELS[person.relationType]}`
                : RELATION_LABELS[person.relationType]}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] text-accent">
            {person.hasQuestionnaire ? "Encontro" : "Aguardando"}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span>Primeiro encontro: {formatDate(person.firstMetAt)}</span>
          <span>Atualizado {formatRelative(person.updatedAt)}</span>
        </div>
        <p className="mt-2 line-clamp-1 text-sm text-muted/90">
          {person.summary || "Resumo ainda em silêncio — a história está só começando."}
        </p>
      </div>
    </Link>
  );
}
