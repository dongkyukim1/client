'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Review } from '@/types/review';
import { FaStar, FaCalendarAlt, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import { formatDate } from '@/utils/dateUtils';
import { getImagesByKeyword } from '@/services/tourImageService';

interface ReviewDetailProps {
  review: Review;
}

export default function ReviewDetail({ review }: ReviewDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [apiImages, setApiImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const fallbackImage = '/images/reviews-og.jpg';

  // API 이미지 가져오기
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoadingImages(true);
        const keyword = review.tags?.[0] || '';
        const tag = review.tags?.join(',') || '';

        const images = await getImagesByKeyword(review.location, keyword, tag);
        const uniqueApiImages = images.filter(apiImg =>
          !review.images?.includes(apiImg)
        );

        setApiImages(uniqueApiImages);
        if (review.images?.length > 0) {
          setSelectedImage(review.images[0]);
        } else if (uniqueApiImages.length > 0) {
          setSelectedImage(uniqueApiImages[0]);
        } else {
          setSelectedImage(fallbackImage);
        }
      } catch (error) {
        console.error('이미지 API 오류:', error);
        setSelectedImage(fallbackImage);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [review]);

  // 이미지 오류 시 대체
  const handleImageError = (imageSrc: string) => {
    setImageError(prev => ({ ...prev, [imageSrc]: true }));
    if (selectedImage === imageSrc) {
      const candidates = [...(review.images || []), ...apiImages];
      const nextValid = candidates.find(img => !imageError[img]) || fallbackImage;
      setSelectedImage(nextValid);
    }
  };

  const isLocalImage = (src: string) => src.startsWith('/');

  const allValidImages = [
    ...(Array.isArray(review.images) ? review.images : []),
    ...(Array.isArray(apiImages) ? apiImages : [])
  ].filter((img): img is string => typeof img === 'string' && !imageError[img]);
  
  const uniqueImages = Array.from(new Set(allValidImages));

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 이미지 영역 */}
      <div className="relative h-96 w-full bg-gray-100">
        {isLoadingImages && !selectedImage ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-pink-500 rounded-full" />
          </div>
        ) : (
          <Image
            src={selectedImage || fallbackImage}
            alt={review.title}
            fill
            className="object-cover"
            onError={() => {
              if (!isLocalImage(selectedImage)) {
                handleImageError(selectedImage);
              }
            }}
            unoptimized
          />
        )}
      </div>

      {/* 썸네일 리스트 */}
      {uniqueImages.length > 1 && (
        <div className="flex p-2 space-x-2 overflow-x-auto">
          {uniqueImages.map((img, idx) => (
            <div
              key={idx}
              className={`relative w-20 h-20 cursor-pointer ${selectedImage === img ? 'ring-2 ring-pink-500' : ''}`}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt={`썸네일 ${idx + 1}`}
                fill
                className="object-cover rounded"
                onError={() => !isLocalImage(img) && handleImageError(img)}
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {/* 상세 내용 */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{review.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <div className="flex items-center mr-4">
            <FaStar className="text-yellow-500 mr-1" />
            <span>{review.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center mr-4">
            <FaCalendarAlt className="text-gray-400 mr-1" />
            <span>{formatDate(review.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-pink-500 mr-1" />
            <span>{review.location}</span>
          </div>
        </div>

        {/* 작성자 */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3">
            <Image
              src={review.author?.avatar || '/images/default-profile.png'}
              alt={review.author?.name || '작성자'}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/default-profile.png';
              }}
            />
          </div>
          <span className="font-medium">{review.author?.name || '익명'}</span>
        </div>

        <div className="whitespace-pre-line leading-relaxed text-gray-700 mb-6">
          {review.content}
        </div>

        {/* 태그 */}
        {review.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {review.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 flex items-center">
                <FaTag className="text-gray-400 mr-1" size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}