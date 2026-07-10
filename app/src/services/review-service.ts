import * as reviewRepository from "@/repositories/review-repository";
import type { ReviewInput } from "@/schemas/review-schema";

export async function getProductReviews(productId: string) {
  const [reviews, aggregate] = await Promise.all([
    reviewRepository.findApprovedReviewsByProduct(productId),
    reviewRepository.getReviewAggregate(productId),
  ]);

  return {
    reviews,
    average: aggregate._avg.rating ?? 0,
    count: aggregate._count.rating,
  };
}

export async function submitReview(
  userId: string,
  productId: string,
  data: ReviewInput
) {
  const existing = await reviewRepository.findReviewByUserAndProduct(userId, productId);
  if (existing) {
    throw new Error("Você já avaliou este produto.");
  }

  const verifiedPurchase = await reviewRepository.hasApprovedPurchase(userId, productId);

  return reviewRepository.createReview({
    productId,
    userId,
    rating: data.rating,
    comment: data.comment || undefined,
    verifiedPurchase,
  });
}
