import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/security/rate-limit";
import {
  generateFreepikImages,
  isFreepikConfigured,
  toFreepikDataUrl
} from "@/lib/services/freepik";

const generateSchema = z.object({
  prompt: z.string().trim().min(3),
  negativePrompt: z.string().trim().min(3).optional(),
  guidanceScale: z.number().min(0).max(2).optional(),
  seed: z.number().int().min(0).max(1000000).optional(),
  numImages: z.number().int().min(1).max(4).optional(),
  size: z
    .enum([
      "square_1_1",
      "classic_4_3",
      "traditional_3_4",
      "widescreen_16_9",
      "social_story_9_16",
      "standard_3_2",
      "portrait_2_3",
      "horizontal_2_1",
      "vertical_1_2",
      "social_post_4_5"
    ])
    .optional(),
  filterNsfw: z.boolean().optional()
});

function shouldBypassRateLimit(request: Request) {
  return process.env.NODE_ENV !== "production" && request.headers.get("x-codex-batch") === "true";
}

export async function POST(request: Request) {
  const limitedResponse = shouldBypassRateLimit(request)
    ? null
    : rateLimit(request, {
        keyPrefix: "freepik-generate",
        limit: 10,
        windowMs: 10 * 60 * 1000,
        message: "Too many Freepik generation requests. Please wait a moment and try again."
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

    const payload = generateSchema.parse(await request.json());
    const response = await generateFreepikImages(payload);

    return NextResponse.json({
      images: response.data.map((item) => ({
        dataUrl: toFreepikDataUrl(item.base64),
        hasNsfw: item.has_nsfw
      })),
      meta: response.meta
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate Freepik image." },
      { status: 400 }
    );
  }
}
