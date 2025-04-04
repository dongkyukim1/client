'use client';

import React, { ButtonHTMLAttributes, ElementType, forwardRef } from 'react';
import useThemeMode from '@/hooks/useDarkMode';
import dynamic from 'next/dynamic';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  as?: ElementType;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  as: Component = 'button',
  ...props
}, ref) => {
  const { themeMode, isLoading } = useThemeMode();
  
  // 기본 스타일 (모든 버튼에 공통으로 적용)
  const baseStyles = "rounded-full transition-colors";
  
  // 크기에 따른 스타일
  let sizeClass = '';
  if (size === 'sm') sizeClass = 'py-1 px-3 text-sm';
  else if (size === 'md') sizeClass = 'p-2 text-base';
  else if (size === 'lg') sizeClass = 'py-3 px-6 text-lg';
  
  // 변형 및 테마에 따른 스타일
  const getVariantClass = () => {
    // 로딩 중이거나 서버사이드 렌더링 중이면 기본 스타일 제공
    if (isLoading) {
      if (variant === 'primary') return 'bg-gray-800 text-white hover:bg-gray-900 border border-gray-800';
      else if (variant === 'secondary') return 'bg-gray-600 text-white hover:bg-gray-700 border border-gray-600';
      else if (variant === 'outline') return 'bg-transparent text-black border-0 hover:bg-gray-50 font-semibold';
      return '';
    }

    // Original 테마
    if (themeMode === 'original') {
      if (variant === 'primary') return 'bg-pink-500 text-white hover:bg-pink-600 border border-none';
      else if (variant === 'secondary') return 'bg-purple-500 text-white hover:bg-purple-600 border border-purple-500';
      else if (variant === 'outline') return 'bg-transparent text-pink-500 border-0 hover:bg-pink-50 font-semibold';
    }
    // Light 테마
    else if (themeMode === 'light') {
      if (variant === 'primary') return 'bg-gray-800 text-white hover:bg-gray-900 border border-gray-800';
      else if (variant === 'secondary') return 'bg-gray-600 text-white hover:bg-gray-700 border border-gray-600';
      else if (variant === 'outline') return 'bg-transparent text-black border-0 hover:bg-gray-50 font-semibold';
    }
    // Dark 테마
    else if (themeMode === 'dark') {
      if (variant === 'primary') return 'bg-pink-500 text-white hover:bg-pink-600 border border-none';
      else if (variant === 'secondary') return 'bg-purple-500 text-white hover:bg-purple-600 border border-purple-500';
      else if (variant === 'outline') return 'bg-transparent text-white border border-pink-500 hover:bg-gray-800 font-semibold';
    }
    
    // 기본값은 Original 테마와 동일
    if (variant === 'primary') return 'bg-pink-500 text-white hover:bg-pink-600 border border-none';
    else if (variant === 'secondary') return 'bg-purple-500 text-white hover:bg-purple-600 border border-purple-500';
    else if (variant === 'outline') return 'bg-transparent text-pink-500 border-0 hover:bg-pink-50 font-semibold';
  };
  
  // 너비 스타일
  const widthClass = fullWidth ? 'w-full' : '';
  
  // 최종 클래스 이름 생성
  const buttonClasses = `${baseStyles} ${sizeClass} ${getVariantClass()} ${widthClass} ${className}`;
  
  return (
    <Component
      className={buttonClasses}
      ref={ref}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </Component>
  );
});

ButtonComponent.displayName = 'Button';

// 클라이언트 전용으로 내보내기
const Button = dynamic(() => Promise.resolve(ButtonComponent), { ssr: true });
export default Button; 