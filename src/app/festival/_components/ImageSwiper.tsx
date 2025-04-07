"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { DetailImage } from "@/types/festival";

interface Props {
  images: DetailImage[];
}

export default function ImageSwiper({ images }: Props) {
  return (
    <Swiper
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="pt-2"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="flex items-center justify-center pb-5">
            <img key={index} src={image.originimgurl} alt={image.imgname} className="size-72 rounded-lg select-none" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
