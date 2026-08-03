import { connectDB } from "@/lib/mongodb";
import { ensureSeed } from "@/lib/seed";
import { Person, Questionnaire } from "@/models";
import type { CreatePersonInput } from "@/lib/validations";
import type { PersonDTO, RelationType } from "@/types";
import { normalizeName } from "@/utils/normalize";
import { toPersonDTO } from "./mappers";

export async function listPeople(search?: string): Promise<PersonDTO[]> {
  await connectDB();
  await ensureSeed();

  const query = search?.trim()
    ? {
        $or: [
          { fullName: { $regex: search.trim(), $options: "i" } },
          { nickname: { $regex: search.trim(), $options: "i" } },
        ],
      }
    : {};

  const people = await Person.find(query).sort({ updatedAt: -1 }).lean();
  const ids = people.map((p) => p._id);
  const answered = await Questionnaire.find({
    personId: { $in: ids },
  }).distinct("personId");
  const answeredSet = new Set(answered.map((id) => id.toString()));

  return people.map((person) =>
    toPersonDTO(person, answeredSet.has(person._id.toString())),
  );
}

export async function getPersonById(id: string): Promise<PersonDTO | null> {
  await connectDB();
  const person = await Person.findById(id);
  if (!person) return null;
  const hasQuestionnaire = Boolean(
    await Questionnaire.exists({ personId: person._id }),
  );
  return toPersonDTO(person, hasQuestionnaire);
}

export async function createPerson(
  input: CreatePersonInput,
): Promise<PersonDTO> {
  await connectDB();
  await ensureSeed();

  const person = await Person.create({
    fullName: input.fullName.trim(),
    nickname: input.nickname?.trim() || undefined,
    relationType: input.relationType,
    notes: input.notes?.trim() || undefined,
    firstMetAt: new Date(),
    summary: "",
    normalizedName: normalizeName(input.fullName),
  });

  return toPersonDTO(person, false);
}

export async function updatePerson(
  id: string,
  input: Partial<CreatePersonInput> & { photoUrl?: string },
): Promise<PersonDTO | null> {
  await connectDB();
  const person = await Person.findById(id);
  if (!person) return null;

  if (input.fullName !== undefined) {
    person.fullName = input.fullName.trim();
    person.normalizedName = normalizeName(input.fullName);
  }
  if (input.nickname !== undefined) {
    person.nickname = input.nickname.trim() || undefined;
  }
  if (input.relationType !== undefined) {
    person.relationType = input.relationType as RelationType;
  }
  if (input.notes !== undefined) {
    person.notes = input.notes.trim() || undefined;
  }
  if (input.photoUrl !== undefined) {
    person.photoUrl = input.photoUrl;
  }

  await person.save();
  const hasQuestionnaire = Boolean(
    await Questionnaire.exists({ personId: person._id }),
  );
  return toPersonDTO(person, hasQuestionnaire);
}

export async function findOrCreatePersonByName(
  fullName: string,
  preferredName?: string,
): Promise<{ person: PersonDTO; created: boolean }> {
  await connectDB();
  await ensureSeed();

  const normalized = normalizeName(fullName);
  const existing = await Person.findOne({ normalizedName: normalized });

  if (existing) {
    if (preferredName && !existing.nickname) {
      existing.nickname = preferredName;
      await existing.save();
    }
    const hasQuestionnaire = Boolean(
      await Questionnaire.exists({ personId: existing._id }),
    );
    return { person: toPersonDTO(existing, hasQuestionnaire), created: false };
  }

  const person = await Person.create({
    fullName: fullName.trim(),
    nickname: preferredName?.trim() || undefined,
    relationType: "amigo",
    firstMetAt: new Date(),
    summary: "",
    normalizedName: normalized,
  });

  return { person: toPersonDTO(person, false), created: true };
}

export async function countPeople(): Promise<number> {
  await connectDB();
  return Person.countDocuments();
}
