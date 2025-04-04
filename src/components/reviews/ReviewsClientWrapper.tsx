"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import ReviewCard from '@/components/reviews/ReviewCard';
import Pagination from '@/components/common/Pagination';
import CreateReviewModal from '@/components/reviews/CreateReviewModal';
import useThemeMode from '@/hooks/useDarkMode';

interface ReviewsWrapperProps {
  reviews: any[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export function NoReviewsFound() {
  const { themeMode } = useThemeMode();
  
  return (
    <div className="text-center py-20">
      <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">등록된 리뷰가 없습니다</h3>
      <p className="mt-4 text-gray-500 dark:text-gray-400">첫 번째 여행 리뷰를 작성해보세요!</p>
      <div className="mt-8">
        <Link 
          href="/travel/create" 
          className="inline-flex items-center px-6 py-3 bg-pink-500 dark:bg-pink-600 text-white rounded-lg shadow-md hover:bg-pink-600 dark:hover:bg-pink-700 transition-colors border-none"
        >
          <FaPlus className="mr-2" />
          <span>리뷰 작성하기</span>
        </Link>
      </div>
    </div>
  );
}

export function ReviewsWrapper({ reviews, totalCount, page, pageSize }: ReviewsWrapperProps) {
  if (reviews.length === 0) {
    return <NoReviewsFound />;
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id}>
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
      
      <div className="mt-10 flex justify-center">
        <Pagination 
          currentPage={page} 
          totalPages={Math.ceil(totalCount / pageSize)} 
          baseUrl="/reviews"
        />
      </div>
    </>
  );
}

export function ReviewsError() {
  return (
    <div className="text-center py-20">
      <h3 className="text-xl font-medium text-red-600 dark:text-red-400">오류가 발생했습니다</h3>
      <p className="mt-4 text-gray-500 dark:text-gray-400">리뷰 목록을 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.</p>
    </div>
  );
}

export default function CreateReviewButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { themeMode } = useThemeMode();
  
  const handleSubmit = async (reviewData: any, proofImage?: File | null, reviewImages?: File[]) => {
    try {
      // 증명 이미지가 없으면 제출 불가
      if (!proofImage) {
        alert('여행 증명 이미지를 업로드해주세요.');
        return;
      }
      
      // API 요청 데이터 구성
      const apiData = {
        startDate: reviewData.startDate || new Date().toISOString().split('T')[0],
        endDate: reviewData.endDate || new Date().toISOString().split('T')[0],
        response: {
          schedule: {
            day_1: {
              spots: [
                {
                  destination_id: "custom", // 커스텀 목적지
                  name: reviewData.title || "여행 장소",
                  addr1: reviewData.location || "",
                  addr2: "",
                  latitude: 0, // 실제 위도가 있다면 추가
                  longitude: 0, // 실제 경도가 있다면 추가
                  content_id: "custom" + Date.now(),
                  category_code: "A02060900",
                  category_name: "도심",
                  type: "tourist_spot"
                }
              ]
            }
          }
        }
      };
      
      // FormData 구성
      const formData = new FormData();
      formData.append('proofImage', proofImage);
      
      // 리뷰 이미지 처리
      if (reviewImages && reviewImages.length > 0) {
        // 첫 번째 이미지는 썸네일로 설정
        formData.append('thumbnailImage', reviewImages[0]);
        
        // 모든 리뷰 이미지 추가
        reviewImages.forEach((file, index) => {
          formData.append(`reviewImages[${index}]`, file);
        });
        
        // 이미지 개수 정보 추가
        formData.append('reviewImageCount', reviewImages.length.toString());
      }
      
      // API 데이터를 JSON으로 변환하여 FormData에 추가
      formData.append('data', JSON.stringify(apiData));
      
      // 리뷰 내용과 평점 추가
      formData.append('title', reviewData.title);
      formData.append('content', reviewData.content);
      formData.append('rating', reviewData.rating.toString());
      formData.append('location', reviewData.location);
      formData.append('createdAt', reviewData.createdAt);
      
      console.log('API 데이터:', apiData);
      console.log('증명 이미지:', proofImage.name);
      
      // API 호출
      const response = await fetch('http://localhost:8080/api/recommend/save', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API 응답:', result);
      
      alert('리뷰가 성공적으로 등록되었습니다!');
      
      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  // 버튼 스타일 결정하기
  const getButtonClasses = () => {
    switch (themeMode) {
      case 'original':
        return "inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg shadow-sm hover:bg-pink-600 transition-colors border-none";
      case 'light':
        return "inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow-sm hover:bg-gray-900 transition-colors border-none";
      case 'dark':
        return "inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg shadow-sm hover:bg-pink-700 transition-colors border-none";
      default:
        return "inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg shadow-sm hover:bg-pink-600 transition-colors border-none";
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={getButtonClasses()}
      >
        <FaPlus className="mr-2" size={14} />
        <span>리뷰 작성하기</span>
      </button>
      
      <CreateReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit} 
        requireProofImage={true}
      />
    </>
  );
}