import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/security/rate-limit";

const handler = NextAuth(authOptions);

export const GET = handler;

export async function POST(request: Request, context: unknown) {
  const limitedResponse = rateLimit(request, {
    keyPrefix: "auth-nextauth-post",
    limit: 20,
    windowMs: 10 * 60 * 1000,
    message: "Too many authentication attempts. Please wait and try again."
  });

  if (limitedResponse) {
    return limitedResponse;
  }

  return handler(request, context as never);
}
