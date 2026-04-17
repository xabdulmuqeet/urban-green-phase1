import { NextResponse } from "next/server";
import type { ApiCartItem } from "@/lib/api-types";
import { normalizeAndMergeCartItems } from "@/lib/commerce";
import { isDatabaseConfigured } from "@/lib/mongoose";
import { rateLimit } from "@/lib/security/rate-limit";
import { buildShippingQuote } from "@/lib/services/shipping-service";
import { shippingQuoteSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const limitedResponse = rateLimit(request, {
    keyPrefix: "checkout-quote",
    limit: 20,
    windowMs: 5 * 60 * 1000,
    message: "Too many delivery quote requests. Please wait a moment and try again."
  });

  if (limitedResponse) {
    return limitedResponse;
  }

  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const payload = shippingQuoteSchema.parse(await request.json());
    const sourceItems = (payload.items ?? []) as ApiCartItem[];

    if (sourceItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const normalizedItems = await normalizeAndMergeCartItems(sourceItems);
    const quote = await buildShippingQuote(normalizedItems, {
      postalCode: payload.postalCode,
      city: payload.city,
      state: payload.state,
      countryCode: payload.countryCode
    });

    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to calculate shipping." },
      { status: 400 }
    );
  }
}
