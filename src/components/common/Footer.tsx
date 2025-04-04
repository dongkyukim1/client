'use client'

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
import Link from 'next/link'
import useThemeMode from '@/hooks/useDarkMode'

export default function Footer() {
  const { themeMode } = useThemeMode()

  // 테마에 따른 클래스 결정
  const getFooterClasses = () => {
    switch (themeMode) {
      case 'original':
        return "bg-white border-t border-pink-100 py-4 transition-colors duration-300";
      case 'light':
        return "bg-white border-t border-gray-200 py-4 transition-colors duration-300";
      case 'dark':
        return "bg-black border-t border-gray-800 py-4 transition-colors duration-300";
      default:
        return "bg-white border-t border-pink-100 py-4 transition-colors duration-300";
    }
  }

  // 텍스트 클래스 결정
  const getTitleClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-sm font-medium text-pink-500";
      case 'light':
        return "text-sm font-medium text-gray-800";
      case 'dark':
        return "text-sm font-medium text-white";
      default:
        return "text-sm font-medium text-pink-500";
    }
  }

  const getSubtitleClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-xs text-pink-400";
      case 'light':
        return "text-xs text-gray-500";
      case 'dark':
        return "text-xs text-gray-400";
      default:
        return "text-xs text-pink-400";
    }
  }

  const getLinkClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-xs text-pink-400 hover:text-pink-600";
      case 'light':
        return "text-xs text-gray-500 hover:text-gray-700";
      case 'dark':
        return "text-xs text-gray-400 hover:text-white";
      default:
        return "text-xs text-pink-400 hover:text-pink-600";
    }
  }

  const getSocialClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-pink-400 hover:text-pink-600";
      case 'light':
        return "text-gray-400 hover:text-gray-600";
      case 'dark':
        return "text-gray-500 hover:text-white";
      default:
        return "text-pink-400 hover:text-pink-600";
    }
  }

  return (
    <footer className={getFooterClasses()}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-6 mb-2 md:mb-0">
            <span className={getTitleClasses()}>TripPlanner AI</span>
            <span className={getSubtitleClasses()}>© 2025</span>
          </div>
          
          <div className="flex flex-wrap items-center">
            <div className="flex mr-6 space-x-4">
              <Link href="/about" className={getLinkClasses()}>회사소개</Link>
              <Link href="/privacy" className={getLinkClasses()}>개인정보</Link>
              <Link href="/terms" className={getLinkClasses()}>이용약관</Link>
              <Link href="/help" className={getLinkClasses()}>고객센터</Link>
            </div>
            
            <div className="flex space-x-3">
              <a href="#" className={getSocialClasses()}>
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className={getSocialClasses()}>
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className={getSocialClasses()}>
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className={getSocialClasses()}>
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}