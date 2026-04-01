import { NextResponse } from "next/server";
import { createReviewSchema } from "@/lib/validators";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongoose";
import { getProductReviewsSummary } from "@/lib/reviews";
import { getCurrentSessionEmail, requireCurrentUser } from "@/lib/session";
import { ProductModel } from "@/models/Product";
import { ReviewModel } from "@/models/Review";

export async function GET(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ reviews: [], averageRating: 0, reviewCount: 0, userReview: null });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId")?.trim();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId." }, { status: 400 });
    }

    await connectToDatabase();
    const email = await getCurrentSessionEmail();
    const user = email ? await requireCurrentUser() : null;

    return NextResponse.json(await getProductReviewsSummary(productId, user ? String(user._id) : undefined));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const email = await getCurrentSessionEmail();

    if (!email) {
      return NextResponse.json({ error: "Sign in to submit a review." }, { status: 401 });
    }

    await connectToDatabase();
    const user = await requireCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Sign in to submit a review." }, { status: 401 });
    }

    const payload = createReviewSchema.parse(await request.json());
    const product = await ProductModel.findOne({ id: payload.productId, type: "plant" }).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const existingReview = await ReviewModel.findOne({
      userId: user._id,
      productId: payload.productId
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product." },
        { status: 409 }
      );
    }

    await ReviewModel.create({
      userId: user._id,
      productId: payload.productId,
      rating: payload.rating,
      comment: payload.comment?.trim() ?? ""
    });

    return NextResponse.json(
      await getProductReviewsSummary(payload.productId, String(user._id)),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit review." },
      { status: 400 }
    );
  }
}
