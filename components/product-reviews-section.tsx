"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import type { ProductReviewsResponse } from "@/lib/api-types";

function renderStars(rating: number) {
  const filledStars = Math.round(rating);
  return "★★★★★"
    .split("")
    .map((star, index) => (index < filledStars ? star : "☆"))
    .join("");
}

export function ProductReviewsSection({
  productId,
  initialReviews
}: {
  productId: string;
  initialReviews: ProductReviewsResponse;
}) {
  const { status } = useSession();
  const [reviewData, setReviewData] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (status !== "authenticated") {
      setMessage("Sign in to leave a review.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          rating,
          comment
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | (ProductReviewsResponse & { error?: string })
        | null;

      if (!response.ok) {
        setMessage(payload?.error ?? "Failed to submit review.");
        return;
      }

      setReviewData(payload as ProductReviewsResponse);
      setComment("");
      setRating(5);
      setMessage("Thanks for sharing your experience.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage">Reviews</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="font-[family:var(--font-heading)] text-3xl">Customer Notes</h2>
            {reviewData.reviewCount > 0 ? (
              <div className="text-lg tracking-[0.16em] text-terracotta">
                {renderStars(reviewData.averageRating)}
              </div>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-bark/75">
            {reviewData.reviewCount > 0
              ? `${reviewData.averageRating.toFixed(1)} out of 5 from ${reviewData.reviewCount} review${reviewData.reviewCount === 1 ? "" : "s"}`
              : "Be the first to review this plant."}
          </p>
        </div>
        {reviewData.reviewCount === 0 ? (
          <p className="text-xl tracking-[0.2em] text-bark/20">{renderStars(0)}</p>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        {reviewData.reviews.length > 0 ? (
          reviewData.reviews.map((review) => (
            <div key={review.id} className="rounded-[1.5rem] border border-black/5 bg-cream/50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">{review.userName}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-bark/60">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                  <div className="text-sm tracking-[0.16em] text-terracotta">
                    {renderStars(review.rating)}
                  </div>
              </div>
              {review.comment ? (
                <p className="mt-3 text-sm leading-6 text-bark/80">{review.comment}</p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-black/5 bg-cream/40 p-5 text-sm text-bark/75">
            No reviews yet. This product is waiting for its first note from a customer.
          </div>
        )}
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-black/5 bg-cream/50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-bark/70">
          Leave a Review
        </p>
        {status !== "authenticated" ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-bark/75">Sign in to leave a rating and comment for this plant.</p>
            <button
              type="button"
              onClick={() => void signIn()}
              className="rounded-full bg-sage px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#6b866e]"
            >
              Sign In
            </button>
          </div>
        ) : reviewData.userReview ? (
          <p className="mt-4 text-sm text-bark/75">
            You&apos;ve already reviewed this product. Thanks for sharing your experience.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="review-rating">
                Rating
              </label>
              <select
                id="review-rating"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="mt-2 w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-foreground outline-none transition focus:border-sage"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="review-comment">
                Comment
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Optional: tell us how this plant feels in your space."
                className="mt-2 min-h-32 w-full rounded-[1.5rem] border border-black/10 bg-white px-5 py-4 text-sm text-foreground outline-none transition focus:border-sage"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
              className="rounded-full bg-terracotta px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#cd624b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}
        {message ? <p className="mt-4 text-sm text-bark/75">{message}</p> : null}
      </div>
    </div>
  );
}
