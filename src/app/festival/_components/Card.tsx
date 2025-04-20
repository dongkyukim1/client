"use client";

import { Festival } from "@/types/festival";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";

interface Props {
  festival: Festival;
}

export default function Card({ festival }: Props) {
  const router = useRouter();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleClick = () => {
    router.push(`/festival/detail/${festival.contentid}`, { scroll: false });
  };

  // 날짜 포맷: 20250420 → 2025.04.20
  const formatDate = (dateStr: string) =>
    dateStr?.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");

  // D-Day 계산 함수
  const getDDayLabel = () => {
    const endDate = new Date(
      Number(festival.eventenddate.slice(0, 4)),
      Number(festival.eventenddate.slice(4, 6)) - 1,
      Number(festival.eventenddate.slice(6, 8))
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays === 0) return "오늘 종료";
    return "종료";
  };

  return (
    <div
      ref={ref}
      className="relative border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleClick}
    >
      {/* 개최중 뱃지 */}
      <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded">
        개최중
      </div>
      
      {/* D-day */}
      <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-white/80 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded border border-gray-300">
        {getDDayLabel()}
      </div>

      {/* 이미지 */}
      {festival.firstimage && inView ? (
        <img
          src={festival.firstimage || "/default-image.jpg"}
          alt={festival.title}
          className="w-full h-60 object-cover"
        />
      ) : (
        <div className="w-full h-60 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          이미지 없음
        </div>
      )}

      {/* 텍스트 정보 */}
      <div className="px-4 py-3">
        <h3 className="text-base font-bold text-gray-800 line-clamp-2">
          {festival.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {formatDate(festival.eventstartdate)} ~ {formatDate(festival.eventenddate)}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {festival.addr1 || "장소 정보 없음"}
        </p>
      </div>
    </div>
  );
}