import { randomUUID } from "crypto";
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

export async function rotateInviteToken(): Promise<string> {
  const settings = await getSettings();
  settings.formInviteToken = randomUUID();
  await settings.save();
  return settings.formInviteToken;
}

export async function updateOwnerDisplayName(name: string) {
  const settings = await getSettings();
  settings.ownerDisplayName = name.trim();
  await settings.save();
  return settings.ownerDisplayName;
}

export async function rotateWidgetToken(): Promise<string> {
  const settings = await getSettings();
  settings.widgetToken = randomUUID();
  await settings.save();
  return settings.widgetToken;
}

export async function validateWidgetToken(token: string): Promise<boolean> {
  if (!token) return false;
  const settings = await getSettings();
  return Boolean(settings.widgetToken && settings.widgetToken === token);
}

export async function getSettingsDTO() {
  const settings = await getSettings();
  return {
    formInviteToken: settings.formInviteToken,
    widgetToken: settings.widgetToken || null,
    ownerDisplayName: settings.ownerDisplayName,
    updatedAt: settings.updatedAt.toISOString(),
  };
}
