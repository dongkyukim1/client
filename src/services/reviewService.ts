import { Review, ReviewListResponse } from '@/types/review';
import { api } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/** 리뷰 조회 */
export async function getReviews(page = 0, size = 10) {
  try {
    const res = await api.get(`${API_URL}/api/receiptReview/reviews`, {
      params: {
        page,
        size
      }
    })
    console.log(res.data)
    return res.data
  } catch (error) {
    console.error("리뷰 조회 API 호출 중 에러: ", error);
  }
}

// 상세 조회
export async function getReviewById(id: number): Promise<Review | null> {
  const res = await fetch(`${API_URL}/api/receiptReview/reviews/${id}`);
  if (!res.ok) return null;
  return res.json();
}

// 등록
export async function createReview(formData: FormData) {
  const res = await fetch(`${API_URL}/api/receiptReview`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('리뷰 등록 실패');
  return res.json();
}