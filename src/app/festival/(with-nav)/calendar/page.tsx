"use client";

import { getNext12Months, getDaysForMonth, getDate } from "@/utils/dateUtils";
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery<FestivalResponse>({
    queryKey: ["festivals"],
    queryFn: getFestivals,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  const items = data?.response.body.items.item.filter((festival) => festival.eventenddate > getDate()); // 끝난 축제 필터링
  const sortedItems = items?.sort((a, b) => Number(a.eventstartdate) - Number(b.eventstartdate)); // 이벤트 시작일 빠른순 정렬

  return (
    <div>
      <div className="fixed top-28 w-full h-12 flex justify-around items-center bg-white z-20">
        {days.map((day) => (
          <div
            key={day}
            className={clsx("font-bold", {
              "text-red-500": day === "일",
              "text-blue-500": day === "토",
            })}
          >
            {day}
          </div>
        ))}
      </div>

      {getNext12Months().map(({ year, month }) => {
        const allDays = getDaysForMonth(year, month);
        const weeks = [];
        for (let i = 0; i < allDays.length; i += 7) {
          weeks.push(allDays.slice(i, i + 7));
        }
        return (
          <div key={`${year}-${month}`}>
            <h2 className="sticky top-16 bg-white h-12 px-4 border-gray-200 flex items-center text-xl font-bold z-10">
              {year}년 {month}월
            </h2>
            <div className="px-4 py-12">
              {weeks.map((week, weekIdx) => (
                <div key={`${year}-${month}-week-${weekIdx}`}>
                  <div className="grid grid-cols-7 gap-2 py-2">
                    {week.map((day, i) => {
                      const isEmpty = !day;
                      const dayStr = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
                      const count = isEmpty
                        ? 0
                        : sortedItems?.filter((item) => item.eventstartdate <= dayStr && dayStr <= item.eventenddate)
                            .length || 0;
                      return (
                        <div
                          key={`${year}-${month}-${weekIdx}-${i}`}
                          onClick={() => !isEmpty && setSelectedDate(dayStr === selectedDate ? null : dayStr)}
                          className={clsx(
                            "aspect-square rounded flex flex-col items-center justify-center select-none relative",
                            isEmpty
                              ? "bg-transparent text-transparent"
                              : "bg-gray-50 hover:bg-gray-200 border cursor-pointer",
                            selectedDate === dayStr && "ring-2 ring-rose-500"
                          )}
                        >
                          {day}
                          {!isEmpty && count > 0 && <span className="text-xs mt-1 text-rose-500">{count}개</span>}
                        </div>
                      );
                    })}
                  </div>
                  <AnimatePresence mode="wait">
                    {selectedDate &&
                      selectedDate.startsWith(`${year}${String(month).padStart(2, "0")}`) &&
                      week.some((d) => selectedDate.endsWith(`${String(d).padStart(2, "0")}`)) && (
                        <motion.div
                          key={selectedDate}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-rose-100 border p-4 my-2 rounded shadow-sm overflow-hidden"
                        >
                          {sortedItems
                            ?.filter((item) => item.eventstartdate < selectedDate && selectedDate < item.eventenddate)
                            .map((item) => (
                              <button
                                key={item.contentid}
                                onClick={() => router.push(`/festival/detail/${item.contentid}`, { scroll: false })}
                                className="m-1 px-2 rounded-md border-1 bg-slate-100 hover:ring-rose-500 hover:ring-1 hover:border-transparent"
                              >
                                {item.title}
                              </button>
                            ))}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
