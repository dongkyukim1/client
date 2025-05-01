import { getReviewById } from "@/services/reviewService";
import ReviewDetail from "@/components/reviews/ReviewDetail";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/common/ShareButtons";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const review = await getReviewById(id);

    if (!review) {
      return {
        title: "리뷰를 찾을 수 없습니다",
        description: "요청하신 리뷰를 찾을 수 없습니다.",
      };
    }

    return {
      title: `${review.title} - 여행 리뷰`,
      description: review.content.substring(0, 150) + (review.content.length > 150 ? "..." : ""),
      openGraph: {
        title: `${review.title} - 여행 리뷰`,
        description: review.content.substring(0, 150) + (review.content.length > 150 ? "..." : ""),
        images:
          review.images && review.images.length > 0
            ? [
                {
                  url: review.images[0],
                  width: 1200,
                  height: 630,
                  alt: review.title,
                },
              ]
            : [
                {
                  url: `/images/reviews-og.jpg`,
                  width: 1200,
                  height: 630,
                  alt: "여행 리뷰",
                },
              ],
      },
    };
  } catch {
    return {
      title: "리뷰를 찾을 수 없습니다",
      description: "요청하신 리뷰를 찾을 수 없습니다.",
    };
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;

  try {
    const review = await getReviewById(id);

    if (!review) {
      notFound();
    }

    // 현재 URL 생성
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const currentUrl = `${baseUrl}/reviews/${id}`;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-8">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/reviews" className="flex items-center text-gray-600 hover:text-pink-500 transition-colors">
              <FaArrowLeft className="mr-2" />
              <span>리뷰 목록으로</span>
            </Link>
            <div className="flex space-x-2">
              <ShareButtons
                title={review.title}
                description={`${review.location} - ${review.content.substring(0, 100)}...`}
                url={currentUrl}
                location={review.location}
              />
            </div>
          </div>

          <ReviewDetail review={review} />

          {/* 여기에 댓글 섹션이나 추천 리뷰 등을 추가할 수 있습니다 */}
        </div>
      </div>
    );
  } catch (error) {
    console.error("리뷰를 불러올 수 없습니다:", error);
    notFound();
  }
}
