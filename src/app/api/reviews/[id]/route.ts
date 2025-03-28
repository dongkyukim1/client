import { NextRequest, NextResponse } from 'next/server';
import { mockReviews } from '@/data/mockReviews';


const locationImageCounts: Record<string, number> = {
  '제주도': 3,
  '서울': 2,
  '부산': 2,
  '경주': 2,
  '전주': 2,
  '강원도': 2
};

interface Params {
  params: {
    id: string;
  };
}

// GET 요청 처리 - 특정 ID의 리뷰 가져오기
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // params 객체 전체를 비동기적으로 처리
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    // 모의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // ID로 리뷰 찾기
    const review = mockReviews.find(review => review.id === id);
    
    if (!review) {
      return NextResponse.json(
        { error: '리뷰를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 이미지 수 조정
    let imageLimitCount = 2; // 기본값
    
    // 위치 기반으로 적절한 이미지 수 찾기
    for (const [loc, count] of Object.entries(locationImageCounts)) {
      if (review.location.includes(loc)) {
        imageLimitCount = count;
        break;
      }
    }
    
    // 이미지 배열 길이 조정
    const adjustedReview = {
      ...review,
      images: review.images.slice(0, imageLimitCount)
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