"use client";

import { Container, Heading, Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import { getReviews } from "@/services/reviewService";
import ReviewCard from "@/components/reviews/ReviewCard";
import Button from "@/components/common/Button";
import { useEffect, useState, useCallback } from "react";
import { ReviewListResponse } from "@/types/review";
import ShareButtons from "@/components/common/ShareButtons";

export default function ReviewsSection() {
  const [reviewsData, setReviewsData] = useState<ReviewListResponse>({
    reviews: [],
    totalCount: 0,
    page: 1,
    pageSize: 3,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetchReviews 함수를 useCallback으로 정의하여 재사용
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("리뷰 데이터 가져오기 시작");
      const data = await getReviews({ page: 1, pageSize: 3 });

      if (!data || data.reviews.length === 0) {
        console.warn("가져온 리뷰 데이터가 없습니다");
        setReviewsData({
          reviews: [],
          totalCount: 0,
          page: 1,
          pageSize: 3,
        });
      } else {
        console.log(`${data.reviews.length}개의 리뷰를 가져왔습니다`);
        setReviewsData(data);
      }
    } catch (error) {
      console.error("리뷰를 가져오는 중 오류 발생:", error);
      setError("리뷰를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
      setReviewsData({
        reviews: [],
        totalCount: 0,
        page: 1,
        pageSize: 3,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 리뷰 데이터 가져오기
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <Box as="section" className="section" bg="white">
      <Container className="section-container">
        <Heading as="h2" className="section-title" textAlign="center">
          여행 리뷰
        </Heading>
        <Text className="section-subtitle" textAlign="center" mx="auto" mb={10}>
          다른 여행자들의 생생한 여행 후기를 만나보세요
        </Text>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Text color="red.500" fontSize="lg" mb={4}>
              {error}
            </Text>
            <Button onClick={fetchReviews} variant="outline" size="md" className="hover:bg-pink-100">
              다시 시도
            </Button>
          </div>
        ) : (
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviewsData.reviews.length > 0 ? (
              reviewsData.reviews.map((review) => (
                <Box key={review.id} className="relative">
                  <ReviewCard review={review} />
                  <Box className="absolute top-2 right-2 z-10">
                    <ShareButtons
                      title={review.title}
                      description={`${review.location} - ${review.content.substring(0, 50)}...`}
                      url={`/reviews/${review.id}`}
                      location={review.location}
                    />
                  </Box>
                </Box>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <Text fontSize="lg" color="gray.500">
                  표시할 리뷰가 없습니다.
                </Text>
              </div>
            )}
          </Box>
        )}

        <Box textAlign="center" mt={8}>
          <Link href="/reviews" passHref>
            <Button variant="primary" size="lg" className="ml-2 hover:bg-pink-600">
              더 많은 리뷰 보기
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
