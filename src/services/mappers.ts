import type { PersonDTO, RelationType } from "@/types";

type PersonLike = {
  _id: { toString(): string };
  fullName: string;
  nickname?: string | null;
  photoUrl?: string | null;
  relationType: RelationType;
  notes?: string | null;
  firstMetAt: Date | string;
  summary?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export function toPersonDTO(
  person: PersonLike,
  hasQuestionnaire = false,
): PersonDTO {
  return {
    id: person._id.toString(),
    fullName: person.fullName,
    nickname: person.nickname || undefined,
    photoUrl: person.photoUrl || undefined,
    relationType: person.relationType,
    notes: person.notes || undefined,
    firstMetAt: new Date(person.firstMetAt).toISOString(),
    summary: person.summary || "",
    createdAt: new Date(person.createdAt).toISOString(),
    updatedAt: new Date(person.updatedAt).toISOString(),
    hasQuestionnaire,
  };
}
