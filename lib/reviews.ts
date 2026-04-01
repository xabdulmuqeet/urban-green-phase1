import { UserModel } from "@/models/User";
import { ReviewModel } from "@/models/Review";

export async function getProductReviewsSummary(productId: string, viewerUserId?: string) {
  const reviews = await ReviewModel.find({ productId }).sort({ createdAt: -1 }).lean();
  const userIds = [...new Set(reviews.map((review) => String(review.userId)))];
  const users = await UserModel.find({ _id: { $in: userIds } }).select("name email").lean();
  const usersById = new Map(users.map((user) => [String(user._id), user]));

  const normalizedReviews = reviews.map((review) => {
    const author = usersById.get(String(review.userId));
    return {
      id: String(review._id),
      userId: String(review.userId),
      userName: author?.name ?? author?.email?.split("@")[0] ?? "Urban Green Customer",
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString()
    };
  });

  const reviewCount = normalizedReviews.length;
  const averageRating =
    reviewCount > 0
      ? Number(
          (
            normalizedReviews.reduce((total, review) => total + review.rating, 0) / reviewCount
          ).toFixed(1)
        )
      : 0;

  return {
    reviews: normalizedReviews,
    averageRating,
    reviewCount,
    userReview:
      viewerUserId
        ? normalizedReviews.find((review) => review.userId === viewerUserId) ?? null
        : null
  };
}
