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
  
  // 로컬 이미지 가져오기 
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoadingImages(true);
        // 리뷰 위치와 태그를 키워드로 사용하여 이미지 검색
        const keyword = review.tags && review.tags.length > 0 ? review.tags[0] : '';
        const tag = review.tags && review.tags.length > 0 ? review.tags.join(',') : '';
        
        // API 호출
        const images = await getImagesByKeyword(review.location, keyword, tag);
        
        // 중복 제거: 리뷰 이미지와 중복되지 않는 API 이미지만 사용
        const uniqueApiImages = images.filter(apiImg => 
          !review.images.some(reviewImg => reviewImg === apiImg)
        );
        
        setApiImages(uniqueApiImages);
        
        // 기존 이미지만 사용 (API 이미지는 이미 리뷰 이미지에 있을 가능성이 높음)
        if (review.images.length > 0 && !selectedImage) {
          setSelectedImage(review.images[0]);
        }
      } catch (error) {
        console.error('이미지 가져오기 오류:', error);
      } finally {
        setIsLoadingImages(false);
      }
    };
    
    fetchImages();
  }, [review.location, review.tags, review.images, selectedImage]);
  
  // 컴포넌트 마운트 시 이미지 초기화
  useEffect(() => {
    if (review.images && review.images.length > 0) {
      setSelectedImage(review.images[0]);
    }
    setImageError({});
  }, [review.images]);
  
  // 이미지 로드 실패 시 처리
  const handleImageError = (imageSrc: string) => {
    console.log('Image error:', imageSrc);
    setImageError(prev => ({
      ...prev,
      [imageSrc]: true
    }));
    
    // 선택된 이미지가 오류난 경우 다른 이미지로 대체
    if (imageSrc === selectedImage) {
      const allImages = [...review.images, ...apiImages];
      const nonErrorImage = allImages.find(img => !imageError[img]);
      
      if (nonErrorImage) {
        setSelectedImage(nonErrorImage);
      } else {
        // 모든 이미지가 에러난 경우 기본 이미지 사용
        const defaultImage = `/images/reviews-og.jpg`;
        setSelectedImage(defaultImage);
      }
    }
  };
  
  // 이미지가 로컬 경로인지 확인
  const isLocalImage = (src: string) => {
    return src.startsWith('/');
  };
  
  // 현재 표시할 모든 이미지 (오류 없는 것만)
  const allValidImages = [...review.images, ...apiImages].filter(img => !imageError[img]);
  
  // 이미지 중복 제거
  const uniqueImages = [...new Set(allValidImages)];
  
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 이미지 갤러리 */}
      <div className="relative h-96 w-full bg-gray-100">
        {isLoadingImages && !selectedImage ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : selectedImage ? (
          <Image
            src={selectedImage}
            alt={review.title}
            fill
            className="object-cover"
            onError={() => !isLocalImage(selectedImage) && handleImageError(selectedImage)}
            priority
            unoptimized={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">이미지를 불러오는 중...</span>
          </div>
        )}
      </div>
      
      {/* 썸네일 이미지 */}
      {uniqueImages.length > 1 && (
        <div className="flex p-2 space-x-2 overflow-x-auto">
          {uniqueImages.map((image, index) => (
            <div 
              key={index} 
              className={`relative w-20 h-20 cursor-pointer ${selectedImage === image ? 'ring-2 ring-pink-500' : ''}`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${review.title} 이미지 ${index + 1}`}
                fill
                className="object-cover rounded"
                onError={() => !isLocalImage(image) && handleImageError(image)}
                unoptimized={true}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* 리뷰 내용 */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{review.title}</h1>
        
        <div className="flex items-center mb-4 text-gray-600">
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
        
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden relative mr-3">
            <Image
              src={review.author.avatar || '/images/default-profile.png'}
              alt={review.author.name}
              fill
              className="object-cover"
              unoptimized={true}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('/images/default-profile.png')) {
                  target.src = '/images/default-profile.png';
                }
              }}
            />
          </div>
          <span className="font-medium">{review.author.name}</span>
        </div>
        
        <div className="whitespace-pre-line leading-relaxed text-gray-700 mb-6">
          {review.content}
        </div>
        
        {/* 태그 */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {review.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 flex items-center"
              >
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