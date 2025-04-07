"use client";

import KakaoMap from "../../_components/KakaoMap";
import { useQuery } from "@tanstack/react-query";
import getFestivals from "../../_services/getFestivals";
import { FestivalResponse } from "@/types/festival";
import { getDate } from "@/utils/dateUtils";

export default function Map() {
  const { data, isLoading, error } = useQuery<FestivalResponse>({
    queryKey: ["festivals"],
    queryFn: getFestivals,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  const items = data?.response.body.items.item.filter((festival) => festival.eventenddate > getDate()); // 끝난 축제 필터링
  const sortedItems = items?.sort((a, b) => Number(a.eventstartdate) - Number(b.eventstartdate)); // 이벤트 시작일 빠른순 정렬

  return (
    <div className="size-full">
      <KakaoMap festivals={sortedItems!} />
    </div>
  );
}
