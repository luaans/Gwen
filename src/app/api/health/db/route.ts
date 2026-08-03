import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[gwen/db-health]", error);
    return NextResponse.json(
      {
        ok: false,
        reason: "db",
      },
      { status: 503 },
    );
  }
}
