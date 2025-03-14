"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosClose } from "react-icons/io";
import Link from "next/link";
import TermsModal from "@/components/modal/TermsModal";
import PrivacyModal from "@/components/modal/PrivacyModal";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // 약관 관련 상태
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const router = useRouter();

  const handleSignup = () => {
    console.log("이메일:", email);
    console.log("비밀번호:", password);
    console.log("닉네임:", nickname);
    console.log("전화번호:", phoneNumber);
    console.log("이용약관 동의:", termsAccepted);
    console.log("개인정보처리방침 동의:", privacyAccepted);
    // 회원가입 로직 추가
  };

  // 모든 필수 약관에 동의했는지 확인
  const allAccepted = termsAccepted && privacyAccepted;

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setIsTermsModalOpen(false);
  };

  const handlePrivacyAccept = () => {
    setPrivacyAccepted(true);
    setIsPrivacyModalOpen(false);
  };

  return (
    <div className="w-dvw md:w-[568px] bg-white md:rounded-3xl max-md:h-dvh shadow-lg overflow-y-scroll">
      <h1>로고</h1>
      <header className="relative h-16 w-full flex items-center justify-center">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 left-4 bg-white hover:!bg-gray-100 rounded-full border-none"
          onClick={() => router.back()}
        >
          <IoIosClose className="size-8" />
        </button>
        {/* 타이틀 */}
        <h2 className="text-lg font-bold text-center">회원가입</h2>
      </header>
      <div className="p-6">
        {/* 회원가입 입력 필드 */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="닉네임 (2자 이상)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <input
            type="text"
            placeholder="전화번호 (010XXXXXXXX)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          
          {/* 약관 동의 체크박스 */}
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="w-4 h-4 accent-rose-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-rose-500 hover:underline bg-transparent border-0"
                >
                  이용약관
                </button>
                에 동의합니다 (필수)
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={() => setPrivacyAccepted(!privacyAccepted)}
                className="w-4 h-4 accent-rose-500"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-rose-500 hover:underline bg-transparent border-0"
                >
                  개인정보처리방침
                </button>
                에 동의합니다 (필수)
              </label>
            </div>
          </div>
          
          <button
            onClick={handleSignup}
            disabled={!allAccepted}
            className={`w-full ${
              allAccepted 
                ? "bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600" 
                : "bg-gray-300 cursor-not-allowed"
            } text-white font-medium px-4 py-3 rounded-lg shadow-md transition-all duration-200 border-none outline-none`}
          >
            회원가입
          </button>
        </div>

        {/* 하단 링크 */}
        <p className="text-sm text-gray-500 text-center mt-4 mb-0">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="text-rose-500 font-medium hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
      
      {/* 모달 컴포넌트 */}
      <TermsModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={handleTermsAccept}
      />
      
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onAccept={handlePrivacyAccept}
      />
    </div>
  );
}
