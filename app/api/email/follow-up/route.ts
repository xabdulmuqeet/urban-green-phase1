import { NextResponse } from "next/server";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongoose";
import { sendDueFollowUpEmails } from "@/lib/services/email-service";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    await connectToDatabase();
    const result = await sendDueFollowUpEmails();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send follow-up emails." },
      { status: 500 }
    );
  }
}
