import { NextRequest, NextResponse } from 'next/server';
import { mockReviews } from '@/data/mockReviews';

// ✨ 모의 데이터 추가 가능하도록 복제본 만들기
let reviewsDB = [...mockReviews];

// 특정 위치에 대한 이미지 수 매핑
const locationImageCounts: Record<string, number> = {
  '제주도': 3,
  '서울': 2,
  '부산': 2,
  '경주': 2,
  '전주': 2,
  '강원도': 2
};

// ✅ 리뷰 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const location = searchParams.get('location') || '';
    const tag = searchParams.get('tag') || '';

    let filteredReviews = [...reviewsDB];
    
    if (location) {
      filteredReviews = filteredReviews.filter(review =>
        review.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (tag) {
      filteredReviews = filteredReviews.filter(review =>
        review.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase())
      ));
    }

    // 이미지 갯수 조정
    filteredReviews = filteredReviews.map(review => {
      let imageLimitCount = 2;
      for (const [loc, count] of Object.entries(locationImageCounts)) {
        if (review.location.includes(loc)) {
          imageLimitCount = count;
          break;
        }
      }
      return {
        ...review,
        images: review.images.slice(0, imageLimitCount)
      };
    });

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

    return NextResponse.json({
      reviews: paginatedReviews,
      totalCount: filteredReviews.length,
      page,
      pageSize
    });
  } catch (error) {
    console.error('리뷰 목록 API 오류:', error);
    return NextResponse.json({ error: '리뷰 목록을 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// ✅ 리뷰 작성 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('새 리뷰 데이터:', body);

    const newReview = {
      id: String(Date.now()), // 간단하게 timestamp를 ID로
      ...body,
      images: body.images || [],
      tags: body.tags || [],
      author: {
        name: "사용자",
        avatar: "/images/default-profile.png"
      }
    };

    reviewsDB.unshift(newReview); // ✨ 맨 앞에 추가
    console.log('현재 리뷰 목록 수:', reviewsDB.length);

    return NextResponse.json({ message: '리뷰가 성공적으로 등록되었습니다.', review: newReview }, { status: 201 });
  } catch (error) {
    console.error('리뷰 작성 API 오류:', error);
    return NextResponse.json({ error: '리뷰 작성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}