import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/mongoose";

export function GET() {
  return NextResponse.json({
    authSecretPresent: Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
    authUrlPresent: Boolean(process.env.NEXTAUTH_URL || process.env.AUTH_URL),
    nextAuthUrl: process.env.NEXTAUTH_URL ?? null,
    nodeEnv: process.env.NODE_ENV,
    mongoConfigured: isDatabaseConfigured(),
    vercelEnv: process.env.VERCEL_ENV ?? null,
    vercelUrlPresent: Boolean(process.env.VERCEL_URL)
  });
}
