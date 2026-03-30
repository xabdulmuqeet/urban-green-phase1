import { NextResponse } from "next/server";
import type { ApiCartItem } from "@/lib/api-types";
import { calculateCartTotal, normalizeAndMergeCartItems } from "@/lib/commerce";
import { requireCurrentUser, getCurrentSessionEmail } from "@/lib/session";
import { saveCartSchema } from "@/lib/validators";
import { isDatabaseConfigured } from "@/lib/mongoose";

export async function GET() {
  try {
    const email = await getCurrentSessionEmail();

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI to .env.local to use cart sync." },
        { status: 503 }
      );
    }

    const user = await requireCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = (user.cart ?? []) as ApiCartItem[];
    return NextResponse.json({
      items,
      totalAmount: calculateCartTotal(items)
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch cart." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const email = await getCurrentSessionEmail();

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI to .env.local to save cart." },
        { status: 503 }
      );
    }

    const user = await requireCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = saveCartSchema.parse(await request.json());
    const normalizedItems = await normalizeAndMergeCartItems(payload.items);
    user.cart = normalizedItems;
    await user.save();

    return NextResponse.json({
      items: normalizedItems,
      totalAmount: calculateCartTotal(normalizedItems)
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save cart." },
      { status: 400 }
    );
  }
}
