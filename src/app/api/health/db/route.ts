import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { ok: false, reason: "missing_uri" },
        { status: 503 },
      );
    }

    await connectDB();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[gwen/db-health]", message);

    let reason = "db";
    if (/bad auth|authentication failed/i.test(message)) reason = "auth";
    else if (/ENOTFOUND|querySrv|timeout|Server selection|IP|whitelist|network/i.test(message)) {
      reason = "network";
    }

    return NextResponse.json({ ok: false, reason }, { status: 503 });
  }
}
