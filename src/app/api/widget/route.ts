import { NextRequest, NextResponse } from "next/server";
import { getLatestOwnerMood } from "@/services/mood.service";
import {
  countOpenReminders,
  listOpenReminders,
} from "@/services/reminder.service";
import {
  getSettings,
  validateWidgetToken,
} from "@/services/settings.service";

export const dynamic = "force-dynamic";

function extractToken(request: NextRequest): string {
  const header = request.headers.get("authorization") || "";
  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }
  return (request.nextUrl.searchParams.get("token") || "").trim();
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!(await validateWidgetToken(token))) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 },
      );
    }

    const [settings, latestMood, reminders, openCount] = await Promise.all([
      getSettings(),
      getLatestOwnerMood(),
      listOpenReminders(1),
      countOpenReminders(),
    ]);

    const next = reminders[0] || null;

    return NextResponse.json({
      ownerName: settings.ownerDisplayName,
      mood: latestMood
        ? {
            label: latestMood.mood,
            note: latestMood.note || null,
            at: latestMood.createdAt,
            score: latestMood.score,
          }
        : null,
      reminder: next
        ? {
            title: next.title,
            reason: next.reason || null,
            personName: next.personName || null,
          }
        : null,
      openReminders: openCount,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Falha ao carregar widget",
      },
      { status: 500 },
    );
  }
}
