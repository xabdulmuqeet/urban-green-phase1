import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/mongoose";

function normalizeWishlistIds(ids: string[]) {
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
}

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI to .env.local to use account wishlist." },
        { status: 503 }
      );
    }

    const user = await requireCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      wishlistIds: normalizeWishlistIds((user.wishlist ?? []) as string[])
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch wishlist." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI to .env.local to use account wishlist." },
        { status: 503 }
      );
    }

    const user = await requireCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json().catch(() => null)) as { wishlistIds?: string[] } | null;
    const wishlistIds = normalizeWishlistIds(payload?.wishlistIds ?? []);

    user.wishlist = wishlistIds;
    await user.save();

    return NextResponse.json({ wishlistIds });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save wishlist." },
      { status: 400 }
    );
  }
}
