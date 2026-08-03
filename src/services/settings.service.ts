import { connectDB } from "@/lib/mongodb";
import { ensureSeed } from "@/lib/seed";
import { Settings } from "@/models";

export async function getSettings() {
  await connectDB();
  await ensureSeed();
  const settings = await Settings.findOne({ key: "global" });
  if (!settings) {
    throw new Error("Configurações não encontradas");
  }
  return settings;
}

export async function getInviteToken(): Promise<string> {
  const settings = await getSettings();
  return settings.formInviteToken;
}

export async function validateInviteToken(token: string): Promise<boolean> {
  const settings = await getSettings();
  return settings.formInviteToken === token;
}
