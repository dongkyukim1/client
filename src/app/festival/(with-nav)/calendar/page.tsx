"use client";

import { getDaysForMonth, getDate } from "@/utils/dateUtils";
import clsx from "clsx";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { FestivalResponse } from "@/types/festival";
import getFestivals from "../../_services/getFestivals";
import { useRouter } from "next/navigation";

const days = ["일", "월", "화", "수", "목", "금", "토"];

export default function Calendar() {
  const router = useRouter();
  const today = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<FestivalResponse>({
    queryKey: ["festivals"],
    queryFn: getFestivals,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  const baseYear = today.getFullYear();
  const baseMonth = today.getMonth();
  const year = new Date(baseYear, baseMonth + currentMonthIndex).getFullYear();
  const month = new Date(baseYear, baseMonth + currentMonthIndex).getMonth() + 1;

  const allDays = getDaysForMonth(year, month); // number | null
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const items = data?.response.body.items.item.filter(
    (festival) => festival.eventenddate > getDate()
  );
  const sortedItems = items?.sort(
    (a, b) => Number(a.eventstartdate) - Number(b.eventstartdate)
  );

  const handleDateClick = (day: number) => {
    const dateStr = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr === selectedDate ? null : dateStr);
  };

  const selectedFestivals = sortedItems?.filter(
    (item) =>
      selectedDate &&
      item.eventstartdate <= selectedDate &&
      selectedDate <= item.eventenddate
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* 상단 제목 */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold text-gray-700">월별 축제 달력</h1>
        <h2 className="text-5xl font-bold text-purple-500 mt-2">
          {year}.{String(month).padStart(2, "0")}
        </h2>
      </div>

      {/* 월 이동 버튼 */}
      <div className="flex justify-center items-center gap-6 mb-6">
        <button
          onClick={() => setCurrentMonthIndex((prev) => prev - 1)}
          className="w-10 h-10 border border-purple-300 rounded-full text-purple-500 text-xl hover:bg-purple-100"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentMonthIndex((prev) => prev + 1)}
          className="w-10 h-10 border border-purple-300 rounded-full text-purple-500 text-xl hover:bg-purple-100"
        >
          →
        </button>
      </div>

      {/* 달력 */}
      <div className="rounded-xl border border-purple-200 overflow-hidden shadow-sm">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 bg-purple-50 text-center text-sm font-bold text-gray-700">
          {days.map((day, i) => (
            <div
              key={day}
              className={clsx(
                "py-3",
                i === 0 && "text-red-500",
                i === 6 && "text-blue-500"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 셀 */}
        <div className="grid grid-cols-7 border-t border-purple-200 bg-white">
          {weeks.map((week, weekIdx) =>
            week.map((day, i) => {
              const isValidDay = typeof day === "number" && !isNaN(day);
              const dateStr = isValidDay
                ? `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`
                : "";

              const count = isValidDay
                ? sortedItems?.filter(
                    (item) =>
                      item.eventstartdate <= dateStr && dateStr <= item.eventenddate
                  ).length || 0
                : 0;

              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={`${weekIdx}-${i}`}
                  onClick={() => isValidDay && handleDateClick(day)}
                  className={clsx(
                    "aspect-square p-2 flex flex-col items-center justify-center text-sm border",
                    !isValidDay
                      ? "bg-gray-50 border-transparent cursor-default"
                      : "bg-white hover:bg-purple-50 cursor-pointer border-purple-100",
                    isSelected && "border-2 border-purple-500 rounded-md"
                  )}
                >
                  {isValidDay && (
                    <>
                      <span
                        className={clsx(
                          "font-bold text-base",
                          isSelected ? "text-purple-700" : "text-gray-800"
                        )}
                      >
                        {day}
                      </span>
                      <span className="text-xs text-purple-500 mt-1">{count}개</span>
                      <span className="text-[10px] text-gray-400">▼</span>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 축제 리스트 */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          {selectedDate
            ? `${selectedDate.slice(0, 4)}년 ${selectedDate.slice(4, 6)}월 ${selectedDate.slice(6, 8)}일의 축제 리스트`
            : "날짜를 선택해 축제를 확인해보세요!"}
        </h3>

        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {selectedFestivals?.map((item) => (
                <div
                  key={item.contentid}
                  className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() =>
                    router.push(`/festival/detail/${item.contentid}`, { scroll: false })
                  }
                >
                  <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                    개최중
                  </div>
                  <img
                    src={item.firstimage || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-800 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.eventstartdate} ~ {item.eventenddate}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.addr1 || "장소 정보 없음"}
                    </p>
                  </div>
                </div>
              ))}
              {selectedFestivals?.length === 0 && (
                <p className="text-gray-500 text-center col-span-3">
                  해당 날짜에 축제가 없습니다.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}