"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosClose } from "react-icons/io";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();

  const handleSignup = () => {
    console.log("이메일:", email);
    console.log("비밀번호:", password);
    console.log("닉네임:", nickname);
    console.log("전화번호:", phoneNumber);
    // 회원가입 로직 추가
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
            placeholder="닉네임 (2자 이상)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <input
            type="text"
            placeholder="전화번호 (010XXXXXXXX)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-medium px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-none outline-none"
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
    </div>
  );
}
