'use client';

import React, { ButtonHTMLAttributes, ElementType, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  as?: ElementType;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  as: Component = 'button',
  ...props
}, ref) => {
  // 기본 스타일 (모든 버튼에 공통으로 적용)
  const baseStyles = "rounded-full transition-colors border-none";
  
  // 크기에 따른 스타일
  let sizeClass = '';
  if (size === 'sm') sizeClass = 'py-1 px-3 text-sm';
  else if (size === 'md') sizeClass = 'p-2 text-base';
  else if (size === 'lg') sizeClass = 'py-3 px-6 text-lg';
  
  // 변형에 따른 스타일
  let variantClass = '';
  if (variant === 'primary') variantClass = 'bg-pink-500 text-white hover:bg-pink-600';
  else if (variant === 'secondary') variantClass = 'bg-purple-500 text-white hover:bg-purple-600';
  else if (variant === 'outline') variantClass = 'bg-transparent text-pink-500 border border-pink-500 hover:bg-pink-50 hover:text-pink-600';
  
  // 너비 스타일
  const widthClass = fullWidth ? 'w-full' : '';
  
  // 최종 클래스 이름 생성
  const buttonClasses = `${baseStyles} ${sizeClass} ${variantClass} ${widthClass} ${className}`;
  
  return (
    <Component
      className={buttonClasses}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button; 