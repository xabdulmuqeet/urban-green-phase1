import { NextResponse } from "next/server";
import type { ApiCartItem } from "@/lib/api-types";
import { normalizeAndMergeCartItems } from "@/lib/commerce";
import { isDatabaseConfigured } from "@/lib/mongoose";
import { buildShippingQuote } from "@/lib/services/shipping-service";
import { isWeatherConfigured } from "@/lib/services/weather-service";
import { shippingQuoteSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    if (!isWeatherConfigured()) {
      return NextResponse.json(
        { error: "Weather service not configured. Add OPENWEATHER_API_KEY to .env.local." },
        { status: 503 }
      );
    }

    const payload = shippingQuoteSchema.parse(await request.json());
    const sourceItems = (payload.items ?? []) as ApiCartItem[];

    if (sourceItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const normalizedItems = await normalizeAndMergeCartItems(sourceItems);
    const quote = await buildShippingQuote(normalizedItems, payload.postalCode);

    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to calculate shipping." },
      { status: 400 }
    );
  }
}
