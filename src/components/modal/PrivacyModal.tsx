"use client";

import Modal from "@/components/common/Modal";
import PrivacyContent from "@/components/content/PrivacyContent";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function PrivacyModal({ isOpen, onClose, onAccept }: PrivacyModalProps) {
  if (!isOpen) return null;
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="개인정보처리방침"
    >
      <div>
        <PrivacyContent />
        <div className="mt-6 flex justify-end">
          <button
            onClick={onAccept}
            className="px-5 py-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-medium rounded-lg border-none"
          >
            동의합니다
          </button>
        </div>
      </div>
    </Modal>
  );
} 