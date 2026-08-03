import { connectDB } from "@/lib/mongodb";
import { ensureSeed } from "@/lib/seed";
import { Journal } from "@/models";

export type JournalDTO = {
  id: string;
  title: string;
  body?: string;
  occurredAt: string;
  tags: string[];
  createdAt: string;
};

function toDTO(doc: {
  _id: { toString(): string };
  title: string;
  body?: string | null;
  occurredAt: Date;
  tags?: string[] | null;
  createdAt: Date;
}): JournalDTO {
  return {
    id: doc._id.toString(),
    title: doc.title,
    body: doc.body || undefined,
    occurredAt: new Date(doc.occurredAt).toISOString(),
    tags: doc.tags || [],
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function listJournalEntries(limit = 50): Promise<JournalDTO[]> {
  await connectDB();
  await ensureSeed();
  const entries = await Journal.find().sort({ occurredAt: -1 }).limit(limit).lean();
  return entries.map((entry) => toDTO(entry as never));
}

export async function createJournalEntry(input: {
  title: string;
  body?: string;
  tags?: string[];
  occurredAt?: Date;
}): Promise<JournalDTO> {
  await connectDB();
  const entry = await Journal.create({
    title: input.title.trim(),
    body: input.body?.trim() || undefined,
    tags: input.tags || [],
    occurredAt: input.occurredAt || new Date(),
  });
  return toDTO(entry);
}

export async function deleteJournalEntry(id: string): Promise<boolean> {
  await connectDB();
  const result = await Journal.findByIdAndDelete(id);
  return Boolean(result);
}
