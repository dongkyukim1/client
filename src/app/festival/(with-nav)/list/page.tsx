"use client";

import { useQuery } from "@tanstack/react-query";
import getFestivals from "../../_services/getFestivals";
import { FestivalResponse } from "@/types/festival";
import Card from "../../_components/Card";
import { getDate } from "@/utils/dateUtils";

export default function FestivalList() {
  const { data, isLoading, error } = useQuery<FestivalResponse>({
    queryKey: ["festivals"],
    queryFn: getFestivals,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  const items = data?.response.body.items.item.filter((festival) => festival.eventenddate > getDate()); // 끝난 축제 필터링
  const sortedItems = items?.sort((a, b) => Number(a.eventstartdate) - Number(b.eventstartdate)); // 이벤트 시작일 빠른순 정렬

  return (
    <div className="px-5 py-4 flex justify-center">
      <ul className="max-w-screen-2xl list-none p-0 transition-all grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {sortedItems?.map((festival) => (
          <li key={festival.contentid}>
            <Card festival={festival} />
          </li>
        ))}
      </ul>
    </div>
  );
}
