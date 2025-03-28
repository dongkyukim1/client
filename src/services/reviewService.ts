import { Review, ReviewListResponse } from '@/types/review';

interface GetReviewsParams {
  page?: number;
  pageSize?: number;
  location?: string;
  tag?: string;
}

export async function getReviews({
  page = 1,
  pageSize = 10,
  location,
  tag,
}: GetReviewsParams = {}): Promise<ReviewListResponse> {
  try {
    // 요청 제한 시간 설정 (5초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // 적절한 baseUrl 결정
    let baseUrl = "";
    if (typeof window !== 'undefined') {
      // 클라이언트 측에서는 현재 사이트의 origin 사용
      baseUrl = window.location.origin;
    } else {
      // 서버 측에서는 환경 변수 또는 기본값 사용
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }

    // API URL 구성
    let url = `${baseUrl}/api/reviews?page=${page}&pageSize=${pageSize}`;
    if (location) url += `&location=${encodeURIComponent(location)}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    
    console.log(`API 호출 URL: ${url}`);

    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API 응답 오류: ${response.status} ${response.statusText}`);
      return { reviews: [], totalCount: 0, page, pageSize };
    }

    // 응답이 JSON 형식인지 확인
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('API가 JSON 응답을 반환하지 않음:', contentType);
      return { reviews: [], totalCount: 0, page, pageSize };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('리뷰 가져오기 오류:', error);
    return { reviews: [], totalCount: 0, page, pageSize };
  }
}

export async function getReviewById(id: string): Promise<Review | null> {
  if (!id) return null;

  try {
    // 요청 제한 시간 설정 (5초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // 적절한 baseUrl 결정
    let baseUrl = "";
    if (typeof window !== 'undefined') {
      // 클라이언트 측에서는 현재 사이트의 origin 사용
      baseUrl = window.location.origin;
    } else {
      // 서버 측에서는 환경 변수 또는 기본값 사용
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }

    const url = `${baseUrl}/api/reviews/${id}`;
    console.log(`API 호출 URL: ${url}`);

    const response = await fetch(url, { 
      signal: controller.signal,
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API 응답 오류: ${response.status} ${response.statusText}`);
      return null;
    }

    // 응답이 JSON 형식인지 확인
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('API가 JSON 응답을 반환하지 않음:', contentType);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('리뷰 상세 가져오기 오류:', error);
    return null;
  }
} 