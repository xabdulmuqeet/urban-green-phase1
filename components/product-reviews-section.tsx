"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/skeleton";
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
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      setIsLoadingReviews(true);

      try {
        const response = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`, {
          cache: "no-store"
        });

        const payload = (await response.json().catch(() => null)) as ProductReviewsResponse | null;

        if (!response.ok || !payload || !isMounted) {
          return;
        }

        setReviewData(payload);
      } catch {
        // Preserve the default empty state if reviews fail to load.
      } finally {
        if (isMounted) {
          setIsLoadingReviews(false);
        }
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, [productId, status]);

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
    <section className="border-t border-[#777777]/20 pt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-[family:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.24em] text-[#516448]/55">
            Reviews
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="font-[family:var(--font-heading)] text-4xl leading-none text-[#486730]">
              Customer Notes
            </h2>
            {reviewData.reviewCount > 0 ? (
              <div className="text-lg tracking-[0.16em] text-[#7a9163]">
                {renderStars(reviewData.averageRating)}
              </div>
            ) : null}
          </div>
          <p className="mt-3 max-w-2xl font-[family:var(--font-body)] text-sm leading-6 text-[#474747]/72">
            {isLoadingReviews
              ? "Loading recent customer notes."
              : reviewData.reviewCount > 0
              ? `${reviewData.averageRating.toFixed(1)} out of 5 from ${reviewData.reviewCount} review${reviewData.reviewCount === 1 ? "" : "s"}`
              : "Be the first to review this plant."}
          </p>
        </div>
        {reviewData.reviewCount === 0 ? (
          <p className="text-xl tracking-[0.2em] text-[#516448]/18">{renderStars(0)}</p>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        {isLoadingReviews ? (
          <>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="border border-[#777777]/10 bg-[#f2f4ef] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
              </div>
            ))}
          </>
        ) : reviewData.reviews.length > 0 ? (
          reviewData.reviews.map((review) => (
            <div key={review.id} className="border border-[#777777]/10 bg-[#f2f4ef] p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-[family:var(--font-body)] text-sm font-semibold text-[#191c1a]">
                    {review.userName}
                  </p>
                  <p className="mt-1 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.18em] text-[#516448]/55">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm tracking-[0.16em] text-[#7a9163]">
                  {renderStars(review.rating)}
                </div>
              </div>
              {review.comment ? (
                <p className="mt-4 max-w-3xl font-[family:var(--font-body)] text-sm leading-7 text-[#474747]/82">
                  {review.comment}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="border border-[#777777]/10 bg-[#f2f4ef] p-5 font-[family:var(--font-body)] text-sm leading-6 text-[#474747]/72">
            No reviews yet. This product is waiting for its first note from a customer.
          </div>
        )}
      </div>

      <div className="mt-24 border border-[#777777]/10 bg-[#eef1ea] p-6 sm:mt-28">
        <p className="font-[family:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#474747]/68">
          Leave a Review
        </p>
        {status === "loading" ? (
          <div className="mt-4 space-y-4">
            <Skeleton className="h-11 w-full rounded-full" />
            <Skeleton className="h-32 w-full rounded-[1.5rem]" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        ) : status !== "authenticated" ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-[family:var(--font-body)] text-sm text-[#474747]/75">
              Sign in to leave a rating and comment for this plant.
            </p>
            <button
              type="button"
              onClick={() => void signIn()}
              className="bg-[#516448] px-5 py-3 font-[family:var(--font-body)] text-sm font-semibold uppercase tracking-[0.18em] text-[#d4e9c5] transition hover:bg-[#486730]"
            >
              Sign In
            </button>
          </div>
        ) : reviewData.userReview ? (
          <p className="mt-4 font-[family:var(--font-body)] text-sm text-[#474747]/75">
            You&apos;ve already reviewed this product. Thanks for sharing your experience.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label
                className="font-[family:var(--font-body)] text-sm font-medium text-[#191c1a]"
                htmlFor="review-rating"
              >
                Rating
              </label>
              <div className="relative mt-2">
                <select
                  id="review-rating"
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="w-full appearance-none border border-[#777777]/15 bg-white px-5 py-3 pr-11 font-[family:var(--font-body)] text-sm text-[#191c1a] outline-none transition focus:border-[#516448]"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} Star{value === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#474747]/45">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.25 4.5L6 8.25L9.75 4.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label
                className="font-[family:var(--font-body)] text-sm font-medium text-[#191c1a]"
                htmlFor="review-comment"
              >
                Comment
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Optional: tell us how this plant feels in your space."
                className="mt-2 min-h-32 w-full border border-[#777777]/15 bg-white px-5 py-4 font-[family:var(--font-body)] text-sm text-[#191c1a] outline-none transition focus:border-[#516448]"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
              className="bg-[#516448] px-5 py-3 font-[family:var(--font-body)] text-sm font-semibold uppercase tracking-[0.18em] text-[#d4e9c5] transition hover:bg-[#486730] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}
        {message ? (
          <p className="mt-4 font-[family:var(--font-body)] text-sm text-[#474747]/75">{message}</p>
        ) : null}
      </div>

      <div className="h-10 sm:h-14" aria-hidden="true" />
    </section>
  );
}
