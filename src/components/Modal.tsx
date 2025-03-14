"use client";

import React, { useEffect, useState, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowModal(true);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    } else {
      setIsAnimating(false);
      
      const timer = setTimeout(() => {
        setShowModal(false);
        document.body.style.overflow = '';
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, handleEsc]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`} 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* 모달 컨테이너 */}
      <div 
        className={`relative bg-white rounded-lg max-w-2xl w-full shadow-lg 
          transform transition-all duration-300 ${
            isAnimating 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 
            id="modal-title" 
            className="text-lg font-medium text-gray-900"
          >
            {title}
          </h3>
        </div>
        
        {/* 콘텐츠 */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        
        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button 
            className="px-5 py-2 bg-pink-500 hover:bg-pink-600  border-none
              text-white font-medium rounded-md shadow-sm
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            onClick={onClose}
          >
            나가기
          </button>
        </div>
      </div>
    </div>
  );
}
