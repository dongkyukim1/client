import { NextRequest, NextResponse } from 'next/server';
import { mockReviews } from '@/data/mockReviews';

// 특정 위치에 대한 실제 존재하는 이미지 수 매핑
const locationImageCounts: Record<string, number> = {
  '제주도': 3,
  '서울': 2,
  '부산': 2,
  '경주': 2,
  '전주': 2,
  '강원도': 2
};

// GET 요청 처리 - 리뷰 목록 가져오기
export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 가져오기
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const location = searchParams.get('location') || '';
    const tag = searchParams.get('tag') || '';

    // 필터링
    let filteredReviews = [...mockReviews];
    
    if (location) {
      filteredReviews = filteredReviews.filter(review => 
        review.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (tag) {
      filteredReviews = filteredReviews.filter(review => 
        review.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }
    
    // 각 리뷰의 이미지 수 조정
    filteredReviews = filteredReviews.map(review => {
      let imageLimitCount = 2; // 기본값
      
      // 위치 기반으로 적절한 이미지 수 찾기
      for (const [loc, count] of Object.entries(locationImageCounts)) {
        if (review.location.includes(loc)) {
          imageLimitCount = count;
          break;
        }
      }
      
      // 이미지 배열 길이 조정
      const adjustedImages = review.images.slice(0, imageLimitCount);
      
      return {
        ...review,
        images: adjustedImages
      };
    });
    
    // 페이지네이션
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    
    // 응답 데이터 구성
    const response = {
      reviews: paginatedReviews,
      totalCount: filteredReviews.length,
      page,
      pageSize
    };
    
    // 실제 API 호출처럼 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('리뷰 목록 API 오류:', error);
    return NextResponse.json(
      { error: '리뷰 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 