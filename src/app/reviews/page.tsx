import { Suspense } from "react";
import { getReviews } from "@/services/reviewService";
import { Metadata } from "next";
import Link from "next/link";
import CreateReviewButton from "@/components/reviews/CreateReviewButton";
import { ReviewsWrapper, ReviewsError } from "@/components/reviews/ReviewsClientWrapper";

interface ReviewsPageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

// 메타데이터 설정
export const metadata: Metadata = {
  title: "여행 리뷰 목록 - 여행 후기 공유 플랫폼",
  description: "다양한 여행지에 대한 실제 사용자들의 생생한 리뷰와 후기를 확인해보세요.",
  openGraph: {
    title: "여행 리뷰 목록 - 여행 후기 공유 플랫폼",
    description: "다양한 여행지에 대한 실제 사용자들의 생생한 리뷰와 후기를 확인해보세요.",
    images: [
      {
        url: "/images/reviews-og.jpg",
        width: 1200,
        height: 630,
        alt: "여행 리뷰 목록",
      },
    ],
  },
};

// 리뷰 목록을 가져오는 비동기 컴포넌트
async function ReviewsList({ page, pageSize }: { page: number; pageSize: number }) {
  try {
    const data = await getReviews({ page, pageSize });
    return <ReviewsWrapper reviews={data.reviews} totalCount={data.totalCount} page={page} pageSize={pageSize} />;
  } catch (error) {
    console.error("리뷰 목록을 불러올 수 없습니다:", error);
    return <ReviewsError />;
  }
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  // searchParams를 await 처리
  const resolvedParams = await Promise.resolve(searchParams);

  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1;
  const pageSize = resolvedParams.pageSize ? parseInt(resolvedParams.pageSize) : 9;

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
            <span>홈으로</span>
          </Link>

          <CreateReviewButton />
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          }
        >
          <ReviewsList page={page} pageSize={pageSize} />
        </Suspense>
      </div>
    </div>
  );
}
