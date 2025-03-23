"use client";

import Modal from "@/components/common/Modal";
import PrivacyContent from "@/components/content/PrivacyContent";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function PrivacyModal({ isOpen, onClose, onAccept }: PrivacyModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="개인정보처리방침"
    >
      <div>
        <PrivacyContent />
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            닫기
          </button>
          <button
            onClick={onAccept}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            동의합니다
          </button>
        </div>
      </div>
    </Modal>
  );
} 