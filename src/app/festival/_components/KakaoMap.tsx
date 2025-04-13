"use client";

import { useEffect } from "react";
import type { Festival } from "@/types/festival";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    kakao: any;
  }
}

interface Props {
  festivals: Festival[];
}

export default function KakaoMap({ festivals }: Props) {
  const router = useRouter();

  useEffect(() => {
    const script: HTMLScriptElement = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(35.77, 128.24);
        const container = document.getElementById("map");
        const options = {
          center: center,
          level: 13,
        };
        const map = new window.kakao.maps.Map(container, options);

        festivals.forEach((festival) => {
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(festival.mapy, festival.mapx),
            clickable: true,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px; white-space:nowrap; font-size:14px;">${festival.title}</div>`,
          });

          window.kakao.maps.event.addListener(marker, "mouseover", makeOverListener(map, marker, infowindow));
          window.kakao.maps.event.addListener(marker, "mouseout", makeOutListener(infowindow));
          window.kakao.maps.event.addListener(marker, "click", () =>
            router.push(`/festival/detail/${festival.contentid}`)
          );
        });

        // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
        function makeOverListener(map, marker, infowindow) {
          return function () {
            infowindow.open(map, marker);
          };
        }

        // 인포윈도우를 닫는 클로저를 만드는 함수입니다
        function makeOutListener(infowindow) {
          return function () {
            infowindow.close();
          };
        }
      });
    });
  }, [festivals]);

  return <div id="map" className="size-full" />;
}
