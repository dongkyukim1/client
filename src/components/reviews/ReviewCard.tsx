import Link from 'next/link';
import Image from 'next/image';
import { Review } from '@/types/review';
import { FaStar } from 'react-icons/fa';
import { formatDate } from '@/utils/dateUtils';
import { useState } from 'react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { id, title, content, images = [], rating, author, location, createdAt } = review;
  const [imgError, setImgError] = useState(false);

  const getDefaultImage = () => {
    switch (location) {
      case '제주도': return '/images/jeju.png';
      case '서울 연남동': return '/images/seoul.jpg';
      case '부산 해운대': return '/images/busan.png';
      case '경주': return '/images/gyeongju.jpg';
      case '전주': return '/images/jeonju.jpg';
      case '강원도 양양': return '/images/gangwon.jpg';
      default: return '/images/reviews-og.jpg';
    }
  };

  const isBase64 = (src: string) => src?.startsWith('data:image/');

  return (
    <Link href={`/reviews/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        {/* 이미지 */}
        <div className="relative h-48 w-full">
          {images.length > 0 ? (
            <Image
              src={imgError ? getDefaultImage() : images[0]}
              alt={`여행 리뷰 이미지: ${title}`}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
              priority
              unoptimized={!isBase64(images[0])}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">이미지 없음</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center text-white">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1" title={title}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{location}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{content}</p>

          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>{author.name}</span>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}