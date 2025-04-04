'use client';

import NavSection from './common/NavSection'
import Footer from './common/Footer'
import useThemeMode from '@/hooks/useDarkMode';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { themeMode, isLoading } = useThemeMode();

  // 테마 변경 시 HTML 및 body 요소에 클래스 적용
  useEffect(() => {
    if (typeof document === 'undefined' || isLoading) return;

    // HTML 요소에 테마 클래스 적용
    document.documentElement.classList.remove('dark', 'light', 'original');
    document.documentElement.classList.add(themeMode);
    
    // 다크모드 특별 처리
    if (themeMode === 'dark') {
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = themeMode === 'original' ? '#ec4899' : '#111827';
    }
  }, [themeMode, isLoading]);

  // 테마에 따른 클래스 결정
  const getLayoutClasses = () => {
    if (isLoading) {
      return "min-h-screen flex flex-col theme-transition bg-white text-gray-800";
    }

    switch (themeMode) {
      case 'original':
        return "min-h-screen flex flex-col theme-transition bg-white text-gray-800";
      case 'light':
        return "min-h-screen flex flex-col theme-transition bg-white text-gray-800";
      case 'dark':
        return "min-h-screen flex flex-col theme-transition bg-black text-white";
      default:
        return "min-h-screen flex flex-col theme-transition bg-white text-gray-800";
    }
  };

  return (
    <div className={getLayoutClasses()} suppressHydrationWarning>
      <NavSection />
      <main className="flex-grow mt-20" suppressHydrationWarning>
        {children}
      </main>
      <Footer />
    </div>
  )
};

// 클라이언트 전용으로 내보내기
export default dynamic(() => Promise.resolve(Layout), { ssr: false }); 