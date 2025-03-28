'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();
  
  // 기존 쿼리 파라미터 유지
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };
  
  // 표시할 페이지 범위 계산
  const getPageRange = () => {
    const delta = 2; // 현재 페이지 기준 양쪽으로 보여줄 페이지 수
    const range = [];
    const rangeWithDots = [];
    
    // 표시할 페이지 범위 계산
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }
    
    // 중간에 ... 추가
    let l;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    
    return rangeWithDots;
  };
  
  // 페이지가 1개만 있으면 표시하지 않음
  if (totalPages <= 1) return null;
  
  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex items-center space-x-1">
        {/* 이전 페이지 버튼 */}
        <li>
          <Link 
            href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
            className={`px-3 py-2 rounded ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:bg-blue-50'
            }`}
            aria-disabled={currentPage === 1}
          >
            이전
          </Link>
        </li>
        
        {/* 페이지 번호 */}
        {getPageRange().map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <Link
                href={createPageUrl(page as number)}
                className={`px-3 py-2 rounded ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
        
        {/* 다음 페이지 버튼 */}
        <li>
          <Link 
            href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
            className={`px-3 py-2 rounded ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:bg-blue-50'
            }`}
            aria-disabled={currentPage === totalPages}
          >
            다음
          </Link>
        </li>
      </ul>
    </nav>
  );
} 