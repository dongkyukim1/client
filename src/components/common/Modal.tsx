"use client";

import { useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 모달이 열릴 때 스크롤 막기
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    // 모달이 닫힐 때 스크롤 복원
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // 모달 외부 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-transparent border-0"
          >
            <IoIosClose className="size-7" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
} 