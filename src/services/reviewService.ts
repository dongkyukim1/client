import { Review, ReviewListResponse } from '@/types/review';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 목록 조회
export async function getReviews(page = 0, size = 10): Promise<ReviewListResponse> {
  const res = await fetch(`http://localhost:8081/api/receiptReview/reviews?page=${page}&size=${size}`);
    if (!res.ok) throw new Error('리뷰 목록을 불러오지 못했습니다');
  return res.json();
}

// 상세 조회
export async function getReviewById(id: number): Promise<Review | null> {
  const res = await fetch(`${API_BASE}/api/receiptReview/reviews/${id}`);
  if (!res.ok) return null;
  return res.json();
}

// 등록
export async function createReview(formData: FormData) {
  const res = await fetch(`${API_BASE}/api/receiptReview`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('리뷰 등록 실패');
  return res.json();
}