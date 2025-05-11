"use client";

// src/app/reviews/page.tsx
import { getReviews } from "@/services/reviewService";
import { ReviewsWrapper } from "@/components/reviews/ReviewsClientWrapper";
import CreateReviewButton from "@/components/reviews/CreateReviewButton";
import Link from "next/link";

interface ReviewsPageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const page = Number(searchParams?.page || 0);
  const size = 10;

  const { content: reviews, totalElements, size: pageSize } = await getReviews(page, size);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">여행 리뷰</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            다양한 여행지에 대한 실제 사용자들의 생생한 리뷰와 후기를 확인해보세요.
          </p>
        </div>

        <div className="flex justify-end mb-6 space-x-3">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 transition-colors"
          >
            홈으로
          </Link>

          <CreateReviewButton />
        </div>

        <ReviewsWrapper reviews={reviews} totalCount={totalElements} page={page} pageSize={pageSize} />
      </div>
    </div>
  );
}
