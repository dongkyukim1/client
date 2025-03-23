export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // YYYY년 MM월 DD일 형식으로 반환
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
} 