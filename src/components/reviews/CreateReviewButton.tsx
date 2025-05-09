"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreateReviewModal from "@/components/reviews/CreateReviewModal";
import { createReview } from "@/services/reviewService";

export default function CreateReviewButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (
    reviewData: {
      title: string;
      content: string;
      location: string;
      rating: number;
      createdAt: string;
      startDate?: string;
      endDate?: string;
      storeName?: string;
      detailedLocation?: string;
      parentLocation?: string;
    },
    proofImage?: File | null,
    reviewImages?: File[]
  ) => {
    try {
      if (!proofImage) {
        alert("영수증 이미지를 첨부해주세요.");
        return;
      }

      const reviewPayload = {
        address: reviewData.location,
        title: reviewData.title,
        content: reviewData.content,
        rating: reviewData.rating
      };

      const formData = new FormData();

      // JSON 형태의 리뷰 정보를 Blob으로 감싸기
      const reviewBlob = new Blob([JSON.stringify(reviewPayload)], {
        type: "application/json"
      });
      formData.append("review", reviewBlob);

      // 리뷰 이미지 리스트 추가
      if (reviewImages && reviewImages.length > 0) {
        reviewImages.forEach((file) => {
          formData.append("images", file);
        });
      }

      // API 호출
      await createReview(formData);

      alert("리뷰가 성공적으로 등록되었습니다!");
      window.location.reload();
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록에 실패했습니다.");
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
        requireProofImage={true}
      />
    </>
  );
}