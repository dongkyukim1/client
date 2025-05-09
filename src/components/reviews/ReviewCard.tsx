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
  const { receiptReviewId, title, content, images = [], rating, nickname, createdAt } = review;
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/reviews/${receiptReviewId}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <div className="relative h-48 w-full">
          {images.length > 0 ? (
            <Image
              src={imgError ? '/images/reviews-og.jpg' : images[0].imageUrl}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
              unoptimized
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

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{content}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{nickname}</span>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}