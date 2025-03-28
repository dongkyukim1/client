export interface Review {
  id: string;
  title: string;
  content: string;
  location: string;
  images: string[];
  rating: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  totalCount: number;
  page: number;
  pageSize: number;
} 