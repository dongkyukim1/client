"use client";

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import CreateReviewModal from '@/components/reviews/CreateReviewModal';

export default function CreateReviewButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSubmit = async (reviewData: any) => {
    try {
      // 여기에 리뷰 데이터 서버 전송 로직을 추가하세요
      console.log('리뷰 데이터:', reviewData);
      
      // 실제 API가 없으므로 성공 메시지만 표시
      alert('리뷰가 성공적으로 등록되었습니다!');
      
      // 필요하다면 페이지 새로고침 또는 리뷰 목록 업데이트
      window.location.reload();
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center border-none px-4 py-2 bg-pink-500 text-white rounded-lg shadow-sm hover:bg-pink-600 transition-colors"
      >
        <FaPlus className="mr-2" size={14} />
        <span>리뷰 작성하기</span>
      </button>
      
      <CreateReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit} 
      />
    </>
  );
} 