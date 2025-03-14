"use client";

import { useState, useCallback, lazy, Suspense } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Modal from "@/components/common/Modal";

// 동적 임포트로 변경 (코드 분할)
const TermsContent = lazy(() => import('@/components/content/TermsContent'));
const PrivacyContent = lazy(() => import('@/components/content/PrivacyContent'));

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSignup: (data: any) => void;
  handleSocialSignup: (provider: string) => void;
}

export default function SignupModal({ 
  isOpen, 
  onClose, 
  handleSignup,
  handleSocialSignup 
}: SignupModalProps) {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [termsPreloaded, setTermsPreloaded] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // useCallback으로 핸들러 최적화
  const openTermsModal = useCallback(() => setIsTermsModalOpen(true), []);
  const closeTermsModal = useCallback(() => setIsTermsModalOpen(false), []);
  
  const openPrivacyModal = useCallback(() => setIsPrivacyModalOpen(true), []);
  const closePrivacyModal = useCallback(() => setIsPrivacyModalOpen(false), []);

  // 모달 버튼 스타일
  const modalButtonStyle = "text-blue-500 hover:text-blue-600 font-medium focus:outline-none focus:underline transition-colors bg-transparent border-0";

  // 마우스가 버튼 위로 올라가면 컴포넌트 미리 로드
  const handleTermsHover = () => {
    if (!termsPreloaded) {
      const preload = import('@/components/content/TermsContent');
      setTermsPreloaded(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 유효성 검사 등 필요한 로직 추가
    handleSignup(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">회원가입</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
              <span className="text-sm text-gray-700">
                <span>
                  <button 
                    type="button"
                    onMouseEnter={handleTermsHover}
                    onClick={openTermsModal} 
                    className={modalButtonStyle}
                  >
                    이용약관
                  </button>
                  {' '}및{' '}
                  <button 
                    type="button"
                    onClick={openPrivacyModal} 
                    className={modalButtonStyle}
                  >
                    개인정보처리방침
                  </button>
                </span>
                {' '}에 동의합니다.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            disabled={!formData.agreeToTerms}
          >
            회원가입
          </button>
        </form>

        <div className="mt-4">
          <div className="relative flex items-center justify-center py-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">또는</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => handleSocialSignup("google")}
            >
              <FaGoogle className="text-red-500" />
              <span>Google로 회원가입</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => handleSocialSignup("github")}
            >
              <FaGithub />
              <span>GitHub로 회원가입</span>
            </button>
          </div>
        </div>
      </div>

      {/* 이용약관 모달 */}
      {isTermsModalOpen && (
        <Modal 
          isOpen={true} 
          onClose={closeTermsModal}
          title="이용약관"
        >
          <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
            <TermsContent />
          </Suspense>
        </Modal>
      )}

      {/* 개인정보처리방침 모달 */}
      {isPrivacyModalOpen && (
        <Modal 
          isOpen={true} 
          onClose={closePrivacyModal}
          title="개인정보처리방침"
        >
          <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
            <PrivacyContent />
          </Suspense>
        </Modal>
      )}
    </div>
  );
} 