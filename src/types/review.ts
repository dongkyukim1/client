export interface ReviewImage {
  reviewImageId: number;
  imageUrl: string;
}

export interface Review {
  receiptReviewId: number;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
  nickname: string;
  images: ReviewImage[];
  address?: string; // 🔧 이 줄 추가
}

export interface ReviewListResponse {
  reviews: Review[];
  totalCount: number;
  size: number;
  number: number;
}