import { NextRequest, NextResponse } from 'next/server';
import { mockReviews } from '@/data/mockReviews';

const locationImageCounts: Record<string, number> = {
  '제주도': 3,
  '서울': 2,
  '부산': 2,
  '경주': 2,
  '전주': 2,
  '강원도': 2,
};

// GET 요청 처리 - 특정 ID의 리뷰 가져오기
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;  

    // 모의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 300));

    const review = mockReviews.find(review => review.id === id);

    if (!review) {
      return NextResponse.json(
        { error: '리뷰를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    let imageLimitCount = 2;

    for (const [loc, count] of Object.entries(locationImageCounts)) {
      if (review.location.includes(loc)) {
        imageLimitCount = count;
        break;
      }
    }

    const adjustedReview = {
      ...review,
      images: review.images.slice(0, imageLimitCount),
    };

    return NextResponse.json(adjustedReview);
  } catch (error) {
    console.error('리뷰 상세 API 오류:', error);
    return NextResponse.json(
      { error: '리뷰를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
