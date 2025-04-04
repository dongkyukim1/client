'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaCamera, FaReceipt, FaMapMarkerAlt, FaTags } from 'react-icons/fa';
import { Review } from '@/types/review';
import { useSession } from 'next-auth/react';

export default function CreateReviewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  
  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // 파일을 Data URL로 변환
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // 영수증 이미지 업로드 처리
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setReceiptImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 태그 추가
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };
  
  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!title || !content || !location || rating === 0) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    if (images.length === 0) {
      setError('최소 한 장의 여행 사진을 업로드해주세요.');
      return;
    }
    
    if (!receiptImage) {
      setError('방문 증명(영수증 또는 입장권 사진)을 업로드해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // 현재는 실제 API 연동이 없으므로 시뮬레이션
      // TODO: 실제 API 연동 구현
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 성공 시 리뷰 목록 페이지로 이동
      router.push('/reviews');
      router.refresh(); // 리뷰 목록 갱신
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      setError('리뷰 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 로그인이 필요한 페이지
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
        <p className="text-gray-600 mb-6">리뷰를 작성하려면 먼저 로그인해주세요.</p>
        <button 
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 border-none"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">여행 리뷰 작성</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목 <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="여행 경험을 잘 표현하는 제목을 입력해주세요"
            required
          />
        </div>
        
        {/* 위치 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            방문 장소 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="여행한 장소를 입력해주세요 (예: 제주도, 부산 해운대)"
              required
            />
          </div>
        </div>
        
        {/* 별점 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            평점 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none border-none"
              >
                <FaStar 
                  className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                />
              </button>
            ))}
            <span className="ml-2 text-gray-600">
              {rating > 0 ? `${rating}.0/5.0` : '평점을 선택해주세요'}
            </span>
          </div>
        </div>
        
        {/* 태그 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            태그
          </label>
          <div className="flex items-center">
            <div className="relative flex-grow">
              <FaTags className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="여행 키워드를 입력해주세요 (예: 맛집, 핫플레이스)"
              />
            </div>
            <button
              type="button"
              onClick={addTag}
              className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 border-none"
            >
              추가
            </button>
          </div>
          
          {/* 태그 표시 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-gray-400 hover:text-gray-600 border-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            리뷰 내용 <span className="text-red-500">*</span>
          </label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="여행 경험, 추천 포인트, 팁 등을 자유롭게 작성해주세요"
            required
          />
        </div>
        
        {/* 여행 사진 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            여행 사진 <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="flex flex-wrap gap-4 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden">
                  <Image
                    src={img}
                    alt={`여행 사진 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 transition-colors"
              >
                <div className="text-center">
                  <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                  <p className="text-gray-500">여행 사진 추가하기</p>
                </div>
              </button>
            </div>
            
            <p className="text-sm text-gray-500">
              여행 장소의 사진을 업로드해주세요. (최대 5장)
            </p>
          </div>
        </div>
        
        {/* 영수증/입장권 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            방문 증명 <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*"
              ref={receiptInputRef}
              onChange={handleReceiptUpload}
              className="hidden"
            />
            
            <div className="flex items-center justify-center mb-4">
              {receiptImage ? (
                <div className="relative w-full max-w-xs h-48 rounded-md overflow-hidden">
                  <Image
                    src={receiptImage}
                    alt="영수증 또는 입장권"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setReceiptImage(null)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => receiptInputRef.current?.click()}
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 transition-colors"
                >
                  <div className="text-center">
                    <FaReceipt className="mx-auto text-gray-400 text-3xl mb-2" />
                    <p className="text-gray-500">방문 증명 사진 추가하기</p>
                    <p className="text-xs text-gray-400 mt-1">(영수증, 입장권 등)</p>
                  </div>
                </button>
              )}
            </div>
            
            <p className="text-sm text-gray-500">
              리뷰 작성을 위해 해당 장소의 영수증, 입장권 또는 방문을 증명할 수 있는 사진을 업로드해주세요.
              <br />이 사진은 리뷰 검증용으로만 사용되며, 다른 사용자에게 공개되지 않습니다.
            </p>
          </div>
        </div>
        
        {/* 오류 메시지 */}
        {error && (
          <div className="p-3 bg-red-50 text-red-500 rounded-md">
            {error}
          </div>
        )}
        
        {/* 제출 버튼 */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            취소
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed border-none"
          >
            {isSubmitting ? '처리 중...' : '리뷰 작성하기'}
          </button>
        </div>
      </form>
    </div>
  );
} 