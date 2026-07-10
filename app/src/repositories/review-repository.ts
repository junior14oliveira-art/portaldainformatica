import { prisma } from "@/lib/prisma";

export function findApprovedReviewsByProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId, approved: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function findReviewByUserAndProduct(userId: string, productId: string) {
  return prisma.review.findFirst({ where: { userId, productId } });
}

export function getReviewAggregate(productId: string) {
  return prisma.review.aggregate({
    where: { productId, approved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });
}

export async function hasApprovedPurchase(userId: string, productId: string) {
  const count = await prisma.orderItem.count({
    where: {
      productId,
      order: {
        userId,
        status: { in: ["PAYMENT_APPROVED", "PROCESSING", "SHIPPED", "DELIVERED"] },
      },
    },
  });
  return count > 0;
}

export function createReview(data: {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  verifiedPurchase: boolean;
}) {
  return prisma.review.create({
    data: {
      ...data,
      approved: true,
    },
  });
}
