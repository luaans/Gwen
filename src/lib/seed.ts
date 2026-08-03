import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Journal, Settings, User } from "@/models";

let seedPromise: Promise<void> | null = null;

export async function ensureSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

async function runSeed(): Promise<void> {
  await connectDB();

  const ownerName = process.env.OWNER_NAME || "Luan Silva";
  const ownerEmail = process.env.OWNER_EMAIL;
  const ownerPassword = process.env.OWNER_PASSWORD;

  if (!ownerEmail || !ownerPassword) {
    throw new Error(
      "OWNER_EMAIL e OWNER_PASSWORD devem estar definidos em .env.local",
    );
  }

  const existingUser = await User.findOne({ email: ownerEmail.toLowerCase() });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(ownerPassword, 12);
    await User.create({
      name: ownerName,
      email: ownerEmail.toLowerCase(),
      passwordHash,
      role: "owner",
    });
  }

  let settings = await Settings.findOne({ key: "global" });
  if (!settings) {
    settings = await Settings.create({
      key: "global",
      formInviteToken: randomUUID(),
      ownerDisplayName: ownerName,
    });
  }

  const journalCount = await Journal.countDocuments();
  if (journalCount === 0) {
    await Journal.create({
      title: "Comecei oficialmente o projeto Gwen.",
      body: "A fundação de uma companion digital feita para uma única pessoa.",
      occurredAt: new Date(),
      tags: ["marco", "gwen"],
    });
  }
}
