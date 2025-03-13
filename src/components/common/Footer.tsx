'use client'

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-6 mb-2 md:mb-0">
            <span className="text-sm font-medium text-gray-800">TripPlanner AI</span>
            <span className="text-xs text-gray-500">© 2025</span>
          </div>
          
          <div className="flex flex-wrap items-center">
            <div className="flex mr-6 space-x-4">
              <Link href="/about" className="text-xs text-gray-500 hover:text-gray-800">회사소개</Link>
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-800">개인정보</Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-800">이용약관</Link>
              <Link href="/help" className="text-xs text-gray-500 hover:text-gray-800">고객센터</Link>
            </div>
            
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-gray-800">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800">
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}