"use client";

import React, { useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import { createPortal } from 'react-dom';

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

  // Portal을 사용하여 모달 렌더링
  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 border-0"
            aria-label="닫기"
          >
            <IoIosClose className="size-7" />
          </button>
        </div>

        <div className="px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">{children}</div>
      </motion.div>
    </div>
  );

  // Modal root 요소에 포털로 렌더링
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
} 