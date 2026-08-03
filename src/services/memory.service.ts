import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models";
import { Types } from "mongoose";
import type { MemoryDTO } from "@/types/dto";

export type { MemoryDTO };

function toDTO(doc: {
  _id: { toString(): string };
  personId?: { toString(): string } | null;
  title: string;
  content: string;
  tags?: string[] | null;
  importance?: number | null;
  occurredAt?: Date | null;
  createdAt: Date;
}): MemoryDTO {
  return {
    id: doc._id.toString(),
    personId: doc.personId?.toString(),
    title: doc.title,
    content: doc.content,
    tags: doc.tags || [],
    importance: doc.importance || 5,
    occurredAt: doc.occurredAt
      ? new Date(doc.occurredAt).toISOString()
      : undefined,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function listMemoriesByPerson(
  personId: string,
): Promise<MemoryDTO[]> {
  await connectDB();
  const memories = await Memory.find({ personId })
    .sort({ occurredAt: -1, createdAt: -1 })
    .lean();
  return memories.map((memory) => toDTO(memory as never));
}

export async function createMemory(input: {
  personId: string;
  title: string;
  content: string;
  tags?: string[];
  importance?: number;
  occurredAt?: Date;
}): Promise<MemoryDTO> {
  await connectDB();
  const memory = await Memory.create({
    personId: new Types.ObjectId(input.personId),
    title: input.title.trim(),
    content: input.content.trim(),
    tags: input.tags || [],
    importance: input.importance || 5,
    occurredAt: input.occurredAt || new Date(),
  });
  return toDTO(memory);
}

export async function deleteMemory(id: string): Promise<boolean> {
  await connectDB();
  const result = await Memory.findByIdAndDelete(id);
  return Boolean(result);
}
