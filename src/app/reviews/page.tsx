import { Suspense } from 'react';
import { getReviews } from '@/services/reviewService';
import { Metadata } from 'next';
import Link from 'next/link';
import ReviewCard from '@/components/reviews/ReviewCard';
import Pagination from '@/components/common/Pagination';
import { FaPlus } from 'react-icons/fa';

// 메타데이터 설정
export const metadata: Metadata = {
  title: '여행 리뷰 목록 - 여행 후기 공유 플랫폼',
  description: '다양한 여행지에 대한 실제 사용자들의 생생한 리뷰와 후기를 확인해보세요.',
  openGraph: {
    title: '여행 리뷰 목록 - 여행 후기 공유 플랫폼',
    description: '다양한 여행지에 대한 실제 사용자들의 생생한 리뷰와 후기를 확인해보세요.',
    images: [{
      url: '/images/reviews-og.jpg',
      width: 1200,
      height: 630,
      alt: '여행 리뷰 목록',
    }],
  },
};

// 리뷰 목록을 가져오는 비동기 컴포넌트
async function ReviewsList({ page, pageSize }: { page: number, pageSize: number }) {
  try {
    const data = await getReviews({ page, pageSize });
    
    if (data.reviews.length === 0) {
      return (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-600">등록된 리뷰가 없습니다</h3>
          <p className="mt-4 text-gray-500">첫 번째 여행 리뷰를 작성해보세요!</p>
          <div className="mt-8">
            <Link 
              href="/travel/create" 
              className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition-colors"
            >
              <FaPlus className="mr-2" />
              <span>리뷰 작성하기</span>
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.reviews.map((review) => (
            <div key={review.id}>
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
          <Pagination 
            currentPage={page} 
            totalPages={Math.ceil(data.totalCount / pageSize)} 
            baseUrl="/reviews"
          />
        </div>
      </>
    );
  } catch (error) {
    console.error('리뷰 목록을 불러올 수 없습니다:', error);
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-medium text-red-600">오류가 발생했습니다</h3>
        <p className="mt-4 text-gray-500">리뷰 목록을 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.</p>
      </div>
    );
  }
}

interface ReviewsPageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
  };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  // searchParams를 비동기적으로 처리하기 위해 props를 await
  const resolvedSearchParams = await Promise.resolve(searchParams);
  
  // URL 파라미터에서 페이지와 페이지 크기 가져오기 (기본값 설정)
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;
  const pageSize = resolvedSearchParams.pageSize ? parseInt(resolvedSearchParams.pageSize) : 9;
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">여행 리뷰</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            다양한 여행지에 대한 실제 사용자들의 생생한 리뷰와 후기를 확인해보세요.
          </p>
        </div>
        
        <div className="flex justify-end mb-6 space-x-3">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 transition-colors"
          >
            <span>홈으로</span>
          </Link>
          <Link 
            href="/travel/create"
            className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg shadow-sm hover:bg-pink-600 transition-colors"
          >
            <FaPlus className="mr-2" size={14} />
            <span>리뷰 작성하기</span>
          </Link>
        </div>
        
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        }>
          <ReviewsList page={page} pageSize={pageSize} />
        </Suspense>
      </div>
    </div>
  );
} 