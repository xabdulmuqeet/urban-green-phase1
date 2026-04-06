import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongoose";
import { rateLimit } from "@/lib/security/rate-limit";
import { UserModel } from "@/models/User";

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  name: z.string().trim().min(1).max(80).optional()
});

export async function POST(request: Request) {
  const limitedResponse = rateLimit(request, {
    keyPrefix: "auth-register",
    limit: 5,
    windowMs: 10 * 60 * 1000,
    message: "Too many sign-up attempts. Please wait a few minutes and try again."
  });

  if (limitedResponse) {
    return limitedResponse;
  }

  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI to .env.local to register users." },
        { status: 503 }
      );
    }

    const payload = registerSchema.parse(await request.json());
    const email = payload.email.toLowerCase();
    const passwordHash = await hash(payload.password, 12);

    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser?.passwordHash) {
      return NextResponse.json(
        { error: "An account with this email already exists. Sign in instead." },
        { status: 409 }
      );
    }

    if (existingUser) {
      existingUser.passwordHash = passwordHash;
      existingUser.name = existingUser.name ?? payload.name ?? email.split("@")[0];
      await existingUser.save();

      return NextResponse.json({ ok: true });
    }

    await UserModel.create({
      email,
      name: payload.name ?? email.split("@")[0],
      passwordHash
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to register user." },
      { status: 400 }
    );
  }
}
