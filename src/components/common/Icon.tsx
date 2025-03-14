// SVG 아이콘을 직접 JSX로 구현하여 별도 로딩 방지
export function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 24 24">
      <path 
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
        stroke="currentColor" 
        fill="none" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
} 