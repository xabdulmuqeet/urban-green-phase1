import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/security/rate-limit";
import { isFreepikConfigured, searchFreepikResources } from "@/lib/services/freepik";

const searchSchema = z.object({
  term: z.string().trim().min(1),
  page: z.coerce.number().int().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  order: z.enum(["relevance", "recent"]).optional(),
  slug: z.string().trim().min(1).optional()
});

export async function GET(request: Request) {
  const limitedResponse = rateLimit(request, {
    keyPrefix: "freepik-resources",
    limit: 30,
    windowMs: 5 * 60 * 1000,
    message: "Too many Freepik search requests. Please wait a moment and try again."
  });

  if (limitedResponse) {
    return limitedResponse;
  }

  try {
    if (!isFreepikConfigured()) {
      return NextResponse.json(
        { error: "Freepik API not configured. Add FREEPIK_API_KEY to .env.local." },
        { status: 503 }
      );
    }

    const url = new URL(request.url);
    const params = searchSchema.parse({
      term: url.searchParams.get("term"),
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      order: url.searchParams.get("order") ?? undefined,
      slug: url.searchParams.get("slug") ?? undefined
    });

    const payload = await searchFreepikResources({
      ...params,
      acceptLanguage: request.headers.get("accept-language") ?? undefined
    });

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search Freepik resources." },
      { status: 400 }
    );
  }
}
