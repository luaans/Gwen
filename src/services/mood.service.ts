import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { MoodEntry } from "@/models/MoodEntry";
import {
  MOOD_OPTIONS,
  type MoodDTO,
  type MoodLabel,
} from "@/types/mood";

export type { MoodDTO, MoodLabel };
export { MOOD_OPTIONS };

function toDTO(doc: {
  _id: { toString(): string };
  personId?: { toString(): string } | null;
  source: string;
  mood: MoodLabel;
  note?: string | null;
  score: number;
  createdAt: Date;
}): MoodDTO {
  return {
    id: doc._id.toString(),
    personId: doc.personId?.toString(),
    source: doc.source,
    mood: doc.mood,
    note: doc.note || undefined,
    score: doc.score,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function createMoodEntry(input: {
  mood: MoodLabel;
  note?: string;
  personId?: string;
  source?: "owner" | "conversation" | "system";
  score?: number;
}): Promise<MoodDTO> {
  await connectDB();
  const preset = MOOD_OPTIONS.find((item) => item.value === input.mood);
  const entry = await MoodEntry.create({
    mood: input.mood,
    note: input.note?.trim() || undefined,
    personId: input.personId
      ? new Types.ObjectId(input.personId)
      : undefined,
    source: input.source || "owner",
    score: input.score || preset?.score || 5,
  });
  return toDTO(entry);
}

export async function listRecentMoods(limit = 12): Promise<MoodDTO[]> {
  await connectDB();
  const items = await MoodEntry.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return items.map((item) => toDTO(item as never));
}

export async function getLatestOwnerMood(): Promise<MoodDTO | null> {
  await connectDB();
  const item = await MoodEntry.findOne({
    source: "owner",
    $or: [{ personId: { $exists: false } }, { personId: null }],
  })
    .sort({ createdAt: -1 })
    .lean();
  return item ? toDTO(item as never) : null;
}

export function detectMoodFromText(text: string): {
  mood: MoodLabel;
  score: number;
} | null {
  const lower = text.toLowerCase();
  if (/radiant|feliz|alegre|animad|maravilh|ótimo|otimo|eufor/.test(lower)) {
    return { mood: "radiante", score: 9 };
  }
  if (/bem|tranquilo|de boa|suave|leve/.test(lower)) {
    return { mood: "bem", score: 7 };
  }
  if (/cansad|exaust|sem energia|sono/.test(lower)) {
    return { mood: "cansado", score: 4 };
  }
  if (/ansios|preocup|nervos|medo/.test(lower)) {
    return { mood: "ansioso", score: 3 };
  }
  if (/trist|mal|chatead|deprim|vazio/.test(lower)) {
    return { mood: "triste", score: 2 };
  }
  if (/irritad|bravo|raiva|puto|estress/.test(lower)) {
    return { mood: "irritado", score: 2 };
  }
  return null;
}
