"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreateReviewModal from "@/components/reviews/CreateReviewModal";

export default function CreateReviewButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (reviewData: any, proofImage?: File | null, reviewImages?: File[]) => {
    try {
      const images: string[] = [];

      if (reviewImages && reviewImages.length > 0) {
        for (const file of reviewImages) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          images.push(base64);
        }
      }

      const newReview = {
        ...reviewData,
        id: Date.now().toString(),
        images,
        author: {
          name: "사용자",
          avatar: "/images/default-profile.png"
        },
        tags: []
      };

      const stored = localStorage.getItem("localReviews");
      const parsed = stored ? JSON.parse(stored) : [];
      parsed.unshift(newReview);
      localStorage.setItem("localReviews", JSON.stringify(parsed));

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