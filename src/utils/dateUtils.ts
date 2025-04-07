export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // YYYY년 MM월 DD일 형식으로 반환
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/** 오늘 날짜를 반환 (YYYYMMDD 형식) */
export function getDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/** 오늘 날짜를 기준으로 작년 날짜 반환 (YYYYMMDD 형식) */
export function getLastYearDate(): string {
  const today = new Date();
  const year = today.getFullYear() - 1;
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/** 오늘 날짜를 기준으로 최근 12개월의 년도와 월을 배열로 반환 */
export function getNext12Months(): { year: number; month: number }[] {
  const today = new Date();
  const months = [];

  let year = today.getFullYear();
  let month = today.getMonth() + 1; // JS month는 0-indexed

  for (let i = 0; i < 12; i++) {
    months.push({ year, month });

    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return months;
}

/** 주어진 년도와 월의 날짜 배열을 반환 */
export function getDaysForMonth(year: number, month: number): string[] {
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekday = firstDay.getDay(); // 0 (일) ~ 6 (토)
  const lastDate = new Date(year, month, 0).getDate(); // 마지막 날짜

  const days: string[] = [];

  // 앞에 빈 칸 채우기 (시작 요일 맞추기용)
  for (let i = 0; i < firstWeekday; i++) {
    days.push("");
  }

  // 날짜 채우기
  for (let day = 1; day <= lastDate; day++) {
    days.push(day.toString());
  }

  return days;
}