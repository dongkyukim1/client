"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import TermsModal from "@/components/modal/TermsModal";
import PrivacyModal from "@/components/modal/PrivacyModal";

interface LoginProps {
  handleLogin?: (provider: string) => void;
}

export default function Login({ handleLogin }: LoginProps) {
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
    { 
      title: "구글", 
      svg: <FaGoogle size={18} />, 
      bgColor: "bg-[#4285F4]", 
      textColor: "text-white", 
      hoverColor: "hover:bg-[#3367D6]", 
      borderColor: "",
      iconBox: "",
      customButton: false
    },
    { 
      title: "네이버", 
      svg: <SiNaver size={20} className="font-bold" />, 
      bgColor: "bg-[#03C75A]", 
      textColor: "text-white", 
      hoverColor: "hover:bg-[#02b350]", 
      borderColor: "",
      iconBox: "",
      customButton: false
    },
    { 
      title: "카카오", 
      svg: <RiKakaoTalkFill size={20} />, 
      bgColor: "bg-[#FEE500]", 
      textColor: "text-gray-800", 
      hoverColor: "hover:bg-[#FDD800]", 
      borderColor: "",
      iconBox: "",
      customButton: false
    },
  ];

  const handleLocalLogin = () => {
    // 로그인 로직
    if (handleLogin) {
      handleLogin("credentials");
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (handleLogin) {
      handleLogin(provider);
    }
  };

  const handleSignup = () => {
    // 회원가입 로직
  };

  const allAccepted = termsAccepted && privacyAccepted;

  return (
    <div className="w-dvw md:w-[500px] bg-white md:rounded-2xl max-md:h-dvh shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {isLoginTab ? "로그인" : "회원가입"}
        </h2>
        <button
          className="text-rose-500 bg-white font-medium transition-colors duration-200 text-sm px-4 py-2 rounded-full hover:bg-gray-50 border border-gray-200"
          onClick={() => setIsLoginTab(!isLoginTab)}
        >
          {isLoginTab ? "회원가입" : "로그인"}
        </button>
      </div>

      <div className="p-8">
        {isLoginTab ? (
          <>
            {/* 이메일 로그인 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 border-none bg-transparent"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showLoginPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end mt-1">
                <button className="text-sm text-gray-600 hover:text-rose-500 border-none bg-transparent">
                  비밀번호를 잊으셨나요?
                </button>
              </div>
              
              <button
                onClick={handleLocalLogin}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-lg shadow-sm transition-colors duration-200 border-0"
              >
                로그인
              </button>
            </div>

            {/* 구분선 */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">또는</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* oauth 로그인 */}
            <div className="space-y-3">
              {oauthItems.map((item) => (
                <button
                  key={item.title}
                  className={`${!item.customButton ? `${item.bgColor} ${item.textColor} ${item.hoverColor} ${item.borderColor} flex items-center justify-center gap-3` : `${item.hoverColor} ${item.borderColor} flex justify-center`} w-full h-12 rounded-lg font-medium transition-colors duration-200 overflow-hidden border-none`}
                  onClick={() => handleSocialLogin(item.title.toLowerCase())}
                >
                  {item.customButton ? (
                    item.svg
                  ) : (
                    <>
                      <span className={`flex items-center justify-center ${item.iconBox || ''}`}>
                        {item.svg}
                      </span>
                      <span>{`${item.title}로 계속하기`}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* 회원가입 입력 필드 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                <input
                  id="nickname"
                  type="text"
                  placeholder="2자 이상의 닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="이메일 주소"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="6자 이상의 비밀번호"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 border-none bg-transparent"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    aria-label={showSignupPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showSignupPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                <input
                  id="phone-number"
                  type="tel"
                  placeholder="숫자만 입력 (01012345678)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all appearance-none"
                />
              </div>
              
              {/* 약관 동의 체크박스 */}
              <div className="space-y-2 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                  <label htmlFor="terms" className="text-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-rose-500 hover:text-rose-600 hover:underline bg-transparent border-0 font-medium text-base"
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
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                  <label htmlFor="privacy" className="text-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="text-rose-500 hover:text-rose-600 hover:underline bg-transparent border-0 font-medium text-base"
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
                className={`w-full mt-4 font-medium py-3 rounded-lg shadow-sm transition-all duration-200 border-0 ${
                  allAccepted 
                    ? "bg-rose-500 hover:bg-rose-600 text-white" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                회원가입
              </button>
            </div>
          </>
        )}
      </div>

      {/* 약관 모달 */}
      {isTermsModalOpen && (
        <TermsModal 
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
          onAccept={() => {
            setTermsAccepted(true);
            setIsTermsModalOpen(false);
          }}
        />
      )}

      {/* 개인정보처리방침 모달 */}
      {isPrivacyModalOpen && (
        <PrivacyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
          onAccept={() => {
            setPrivacyAccepted(true);
            setIsPrivacyModalOpen(false);
          }}
        />
      )}
    </div>
  );
}