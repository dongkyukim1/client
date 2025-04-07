"use client";

import { FaUserCircle, FaMapMarkedAlt, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Button from "@/components/common/Button";

export default function NavSection() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    if (session?.user) {
      signOut();
    } else router.push("/login", { scroll: false });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ${
        scrolled ? "shadow-md py-3" : "py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <FaMapMarkedAlt className="text-rose-500 text-3xl mr-2 transition-transform group-hover:scale-110 duration-300" />
          <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            TripPlanner AI
          </span>
        </Link>

        <div className="hidden md:flex items-center justify-center max-w-md w-full mx-4">
          <div className="relative w-full">
            <div className="flex items-center rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden pl-5 pr-2 py-2">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="어디로 여행가세요?"
                  className="w-full text-sm focus:outline-none border-none"
                />
              </div>
              <Button variant="primary" size="sm" className="ml-2 rounded-full">
                <FaSearch className="text-sm" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <Link
            href="/festival"
            className="hidden md:block text-gray-600 text-sm font-medium hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            축제
          </Link>
          <Link
            href="/recommendation"
            className="hidden md:block text-gray-600 text-sm font-medium hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            여행 코스
          </Link>
          <Link
            href="/destinations"
            className="hidden md:block text-gray-600 text-sm font-medium hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            인기 여행지
          </Link>
          <Link
            href="/reviews"
            className="hidden md:block text-gray-600 text-sm font-medium hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            리뷰보기
          </Link>
          <Link href="/dashboard" className="hidden md:block">
            <Button variant="outline" size="sm" className="font-medium">
              AI 여행 계획
            </Button>
          </Link>

          <Link href="/dashboard" className="md:hidden">
            <Button variant="primary" size="sm" className="text-xs">
              AI 여행
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="ml-1 flex items-center gap-2"
            onClick={handleLoginClick}
            aria-label={session?.user.name ?? "로그인"}
          >
            <FaUserCircle className="text-gray-500" />
            <span className="hidden md:block text-sm font-medium">{session?.user.name ?? "로그인"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
