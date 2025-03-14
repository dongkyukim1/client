"use client";

import Modal from "@/components/common/Modal";
import TermsContent from '@/components/content/TermsContent';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null;
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="이용약관"
    >
      <div>
        <TermsContent />
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