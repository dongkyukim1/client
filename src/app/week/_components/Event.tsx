"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AreaBasedList } from "@/types/tourInfo";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import getDetailIntro from "@/app/festival/_services/getDetailIntro";
import { formatDateDot } from "@/utils/dateUtils";

interface Props {
  area: string;
  areaBasedList: AreaBasedList[];
}

interface FestivalDetail {
  eventstartdate?: string;
  eventenddate?: string;
  eventplace?: string;
}

export default function Event({ area, areaBasedList }: Props) {
  const [details, setDetails] = useState<Record<string, FestivalDetail>>({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const promises = areaBasedList.map((festival) => getDetailIntro(festival.contentid));
        const results = await Promise.all(promises);

        const detailMap: Record<string, FestivalDetail> = {};
        results.forEach((res) => {
          const item = res.response.body.items.item[0];
          if (item) {
            detailMap[item.contentid] = {
              eventstartdate: item.eventstartdate,
              eventenddate: item.eventenddate,
              eventplace: item.eventplace,
            };
          }
        });

        setDetails(detailMap);
      } catch (error) {
        console.error("축제 상세 정보를 가져오는 데 실패했습니다", error);
      }
    };

    if (areaBasedList.length > 0) {
      fetchDetails();
    }
  }, [areaBasedList]);

  return (
    <section className="mx-auto px-4 py-16 max-w-6xl">
      <h2 className="text-3xl font-bold mb-12 text-center">{area}에서 열리는 이벤트</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {areaBasedList.map((event, index) => {
          const detail = details[event.contentid];
          return (
            <Link
              key={index}
              href={`/festival/detail/${event.contentid}`}
              className="relative rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group block"
            >
              {/* 이미지 */}
              <div className="h-56 overflow-hidden">
                {event.firstimage ? (
                  <img
                    src={event.firstimage}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
                    이미지 없음
                  </div>
                )}
              </div>

              {/* 내용 */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>

                {/* 날짜 */}
                {detail?.eventstartdate && (
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FaCalendarAlt className="mr-2 text-pink-500" />
                    {formatDateDot(detail.eventstartdate)} ~ {formatDateDot(detail.eventenddate)}
                  </div>
                )}

                {/* 장소 */}
                {detail?.eventplace && (
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    {detail.eventplace}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
