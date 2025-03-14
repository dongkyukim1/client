"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosClose } from "react-icons/io";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import TermsModal from "@/components/modal/TermsModal";
import PrivacyModal from "@/components/modal/PrivacyModal";

export default function Login() {
  // 탭 전환
  const [isLoginTab, setIsLoginTab] = useState(true);

  // 로그인 입력 상태
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // 회원가입 입력 상태
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const router = useRouter();

  const oauthItems = [
    { title: "구글", svg: <FaGoogle /> },
    { title: "네이버", svg: <SiNaver /> },
    { title: "카카오", svg: <RiKakaoTalkFill size={20} /> },
  ];

  const handleLogin = () => {
    // 로그인 로직
  };

  const handleSignup = () => {
    // 회원가입 로직
  };

  const allAccepted = termsAccepted && privacyAccepted;

  return (
    <div className="w-dvw md:w-[568px] bg-white md:rounded-3xl max-md:h-dvh shadow-lg">
      <header className="relative h-16 w-full flex items-center justify-center">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 left-4 bg-white hover:!bg-gray-100 rounded-full border-none"
          onClick={() => router.back()}
        >
          <IoIosClose className="size-8" />
        </button>
        {/* 타이틀 */}
        <h1 className="text-xl font-bold text-center pt-2">
          {isLoginTab ? "로그인" : "회원가입"}
        </h1>
      </header>
      <div className="border"></div>

      <div className="p-6">
        {isLoginTab ? (
          <>
            {/* 이메일 로그인 */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="이메일"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="비밀번호"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 border-none bg-transparent"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-medium px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-none outline-none"
              >
                로그인
              </button>
            </div>

            {/* 구분선 */}
            <div className="flex items-center my-6">
              <div className="flex-1 border border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">또는</span>
              <div className="flex-1 border border-gray-300"></div>
            </div>

            {/* oauth 로그인 */}
            <div className="space-y-4">
              {oauthItems.map((item) => (
                <button
                  key={item.title}
                  className="bg-white hover:!bg-gray-100 flex items-center px-4 w-full h-12 text-sm border border-black rounded-lg"
                >
                  <div className="size-5 flex items-center justify-center">
                    {item.svg}
                  </div>
                  <div className="flex-1">{`${item.title}로 로그인하기`}</div>
                </button>
              ))}
            </div>

            {/* 회원가입 유도 */}
            <p className="text-sm text-gray-500 text-center mt-4">
              아직 회원이 아니신가요?{" "}
              <button
                onClick={() => setIsLoginTab(false)}
                className="text-rose-500 font-medium hover:underline border-none bg-transparent"
              >
                회원가입
              </button>
            </p>
          </>
        ) : (
          <>
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
                type="email"
                placeholder="이메일"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="비밀번호 (6자 이상)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 border-none bg-transparent"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </div>
              <input
                type="number"
                placeholder="전화번호 (010XXXXXXXX)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none"
              />
              
              {/* 약관 동의 체크박스 추가 */}
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
                } text-white font-medium px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-none outline-none`}
              >
                회원가입
              </button>
            </div>

            {/* 로그인 유도 */}
            <p className="text-sm text-gray-500 text-center mt-4">
              이미 계정이 있으신가요?{" "}
              <button
                onClick={() => setIsLoginTab(true)}
                className="text-rose-500 font-medium hover:underline border-none bg-transparent"
              >
                로그인
              </button>
            </p>
          </>
        )}
      </div>

      {/* 모달 컴포넌트 */}
      <TermsModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setIsTermsModalOpen(false);
        }}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onAccept={() => {
          setPrivacyAccepted(true);
          setIsPrivacyModalOpen(false);
        }}
      />
    </div>
  );
}