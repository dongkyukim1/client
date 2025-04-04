"use client";

import { useState, useRef, useEffect } from 'react';
import { FaTimes, FaStar, FaUpload, FaCheck, FaSpinner, FaImage, FaTrash } from 'react-icons/fa';
import useThemeMode from '@/hooks/useDarkMode';

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: {
    title: string;
    content: string;
    location: string;
    rating: number;
    createdAt: string;
    startDate?: string;
    endDate?: string;
    storeName?: string;
    detailedLocation?: string;
    parentLocation?: string;
  }, proofImage?: File | null, reviewImages?: File[]) => void;
  requireProofImage?: boolean;
}

interface ExtractedTravelInfo {
  location?: string;
  parentLocation?: string;
  storeName?: string;
  date?: string;
}

// 지역 정보 매핑
const LOCATION_MAPPING = {
  // 서울 지역
  '강남구': '서울',
  '서초구': '서울',
  '종로구': '서울',
  '마포구': '서울',
  '송파구': '서울',
  '용산구': '서울',
  '영등포구': '서울',
  // 경기도 지역
  '일산동구': '경기도',
  '일산서구': '경기도',
  '분당구': '경기도',
  '덕양구': '경기도',
  '일산': '경기도',
  '분당': '경기도',
  '판교': '경기도',
  '동탄': '경기도',
  // 제주도
  '제주': '제주도',
  '서귀포': '제주도',
  // 기타 도시
  '부산': '부산',
  '대구': '대구',
  '인천': '인천',
  '광주': '광주',
  '대전': '대전',
  '울산': '울산',
  '세종': '세종'
} as const;

// 지역 표시 포맷팅 함수
const formatLocation = (location: string, parentLocation?: string) => {
  // 지역과 상위지역이 같은 경우 (예: location='제주', parentLocation='제주도')
  if (location && parentLocation && parentLocation.includes(location)) {
    return parentLocation;
  }
  // 그 외의 경우 "상위지역 하위지역" 형식으로 표시
  return location && parentLocation ? `${parentLocation} ${location}` : location || parentLocation || '';
};

export default function CreateReviewModal({ isOpen, onClose, onSubmit, requireProofImage = false }: CreateReviewModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const { themeMode } = useThemeMode();
  
  // 증명 이미지 업로드 관련 상태
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const proofImageInputRef = useRef<HTMLInputElement>(null);
  
  // 리뷰 이미지 업로드 관련 상태
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState<string[]>([]);
  const reviewImagesInputRef = useRef<HTMLInputElement>(null);

  // 모달 트랩 포커스 효과를 위한 ref
  const modalRef = useRef<HTMLDivElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedTravelInfo>({});
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    // ESC 키로 모달 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // 모달 열릴 때 포커스 설정
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // 스캔 애니메이션 효과
  useEffect(() => {
    if (isScanning) {
      let position = 0;
      const scanInterval = setInterval(() => {
        position += 2;
        setScanPosition(position);
        if (position > 100) {
          position = 0;
          setScanPosition(0);
        }
      }, 50);
      
      return () => clearInterval(scanInterval);
    }
  }, [isScanning]);

  if (!isOpen) return null;

  // 여행 관련 정보 추출 함수
  const extractTravelInfo = (text: string): ExtractedTravelInfo => {
    const info: ExtractedTravelInfo = {};
    
    // 출발지-도착지 패턴 (항공권)
    // "서울 -- 제주" 또는 "서울→제주" 형식 통합
    const flightRoutePattern = /(서울|부산|제주|대구|인천|광주|대전|울산|세종)\s*(?:--|→|⇒)\s*(서울|부산|제주|대구|인천|광주|대전|울산|세종)/;
    const flightRouteMatch = text.match(flightRoutePattern);

    if (flightRouteMatch) {
      try {
        // 전체 매치된 문자열에서 도시 이름만 추출
        const cities = flightRouteMatch[0].split(/\s*(?:--|→|⇒)\s*/);
        if (cities.length >= 2) {
          const arrival = cities[1];
          info.location = arrival;
          info.parentLocation = LOCATION_MAPPING[arrival as keyof typeof LOCATION_MAPPING];
        }
      } catch (error) {
        console.error('항공권 정보 추출 중 오류:', error);
      }
    }

    if (!info.location) {
      // 기존 지역 패턴 (구/동 단위)
      const locationPattern = new RegExp(Object.keys(LOCATION_MAPPING).join('|'), 'g');
      const locationMatch = text.match(locationPattern);
      if (locationMatch) {
        info.location = locationMatch[0];
        info.parentLocation = LOCATION_MAPPING[info.location as keyof typeof LOCATION_MAPPING];
      }
    }

    // 날짜 패턴 (YYYY-MM-DD 또는 YYYY/MM/DD 또는 YYYY.MM.DD)
    const datePattern = /\d{4}[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])/g;
    const dateMatch = text.match(datePattern);
    if (dateMatch) {
      info.date = dateMatch[0];
    }

    // 항공사/상호명 패턴
    const airlinePattern = /(제주항공|대한항공|아시아나|에어부산|티웨이|진에어|이스타|에어서울)/;
    const airlineMatch = text.match(airlinePattern);
    if (airlineMatch) {
      info.storeName = airlineMatch[0];
    } else {
      // 일반 상호명 패턴
      const storePattern = /[\w가-힣]{2,}(?:점|매장|마트|백화점|센터|카페|레스토랑|호텔|리조트)/g;
      const storeMatch = text.match(storePattern);
      if (storeMatch) {
        info.storeName = storeMatch[0];
      }
    }

    return info;
  };

  // 이미지에서 텍스트 추출 함수
  const extractTextFromImage = async (file: File) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      const imageDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const imageData = await imageDataPromise;
      
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      
      const data = await response.json();
      if (data.text) {
        const info = extractTravelInfo(data.text);
        setExtractedInfo(info);
        
        // 지역 정보가 있으면 자동으로 입력
        if (info.parentLocation) {
          setLocation(info.parentLocation);
        }
      }
    } catch (error) {
      console.error('이미지 처리 중 오류 발생:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProofFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProofImage(file);
      
      // 스캔 애니메이션 시작
      setIsScanning(true);
      setScanComplete(false);
      
      // 초기화
      setExtractedInfo({});
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = async () => {
        // 스캔 애니메이션 표시를 위해 더 긴 지연 추가
        setTimeout(async () => {
          setImagePreview(reader.result as string);
          
          // 텍스트 추출 시작 전에 스캔 애니메이션을 더 오래 보여줌
          await new Promise(resolve => setTimeout(resolve, 2000));
          await extractTextFromImage(file);
          
          // 스캔 완료 애니메이션
          setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
          }, 1000);
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleReviewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      
      // 최대 5개까지만 허용
      const totalFiles = [...reviewImages, ...newFiles];
      const filesToAdd = totalFiles.slice(0, 5);
      
      if (totalFiles.length > 5) {
        alert('최대 5개의 이미지만 업로드할 수 있습니다.');
      }
      
      setReviewImages(filesToAdd);
      
      // 이미지 미리보기 생성
      Promise.all(
        filesToAdd.map(file => 
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          })
        )
      ).then(previews => {
        setReviewImagePreviews(previews);
      });
    }
  };
  
  const removeReviewImage = (index: number) => {
    const newImages = [...reviewImages];
    newImages.splice(index, 1);
    setReviewImages(newImages);
    
    const newPreviews = [...reviewImagePreviews];
    newPreviews.splice(index, 1);
    setReviewImagePreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 이미지 체크
    if (!proofImage) {
      alert('여행 증명 이미지가 필요합니다. 영수증, 항공권, 버스티켓 등을 업로드해주세요.');
      return;
    }
    
    // 추출된 정보를 포함한 리뷰 데이터 구성
    const reviewData = {
      title,
      content,
      location,
      rating,
      createdAt: new Date().toISOString(),
      // 추출된 정보 추가 (undefined 값은 옵셔널 프로퍼티로 처리)
      ...(extractedInfo.date && { startDate: extractedInfo.date }),
      ...(extractedInfo.date && { endDate: extractedInfo.date }),
      ...(extractedInfo.storeName && { storeName: extractedInfo.storeName }),
      ...(extractedInfo.location && { detailedLocation: extractedInfo.location }),
      ...(extractedInfo.parentLocation && { parentLocation: extractedInfo.parentLocation })
    };
    
    onSubmit(reviewData, proofImage, reviewImages);
    
    // 폼 초기화
    setTitle('');
    setContent('');
    setLocation('');
    setRating(5);
    setProofImage(null);
    setImagePreview(null);
    setScanComplete(false);
    setExtractedInfo({});
    setReviewImages([]);
    setReviewImagePreviews([]);
    
    onClose();
  };

  // 테마에 따른 모달 배경 스타일
  const getModalStyle = () => {
    switch (themeMode) {
      case 'dark':
        return 'bg-gray-900 border border-gray-700 shadow-2xl';
      case 'light':
        return 'bg-white border border-gray-200 shadow-xl';
      case 'original':
        return 'bg-white border border-pink-100 shadow-xl';
      default:
        return 'bg-white border border-gray-200 shadow-xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-all">
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`${getModalStyle()} rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transition-colors duration-300 transform animate-modal-scale`}
      >
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">리뷰 작성하기</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-none"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {/* 증명 이미지 업로드 영역을 맨 위로 이동 */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                여행 증명 이미지 {requireProofImage && <span className="text-red-500">*</span>}
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                  영수증, 항공권, 버스티켓 등 여행을 증명할 수 있는 이미지를 업로드해주세요
                </span>
              </label>
              
              <div className="mt-3">
                {isScanning ? (
                  <div className="relative border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden h-64 bg-gray-50 dark:bg-gray-900">
                    {/* 이미지 컨테이너 */}
                    <div className="absolute inset-0">
                      {imagePreview && (
                        <img 
                          src={imagePreview} 
                          alt="스캔 중인 이미지" 
                          className="w-full h-full object-contain opacity-90"
                        />
                      )}
                    </div>

                    {/* 스캔 라인 - 직접 위치 조정 */}
                    <div 
                      className="absolute inset-x-0 z-30 pointer-events-none"
                      style={{
                        top: `${scanPosition}%`,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #ec4899 50%, transparent)',
                        boxShadow: '0 0 20px 5px rgba(236, 72, 153, 0.7)',
                        filter: 'blur(0.5px)'
                      }}
                    >
                      {/* 레이저 빔 효과 */}
                      <div 
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          height: '50px',
                          background: 'linear-gradient(180deg, rgba(236, 72, 153, 0.5), transparent)',
                          transform: 'translateY(0)'
                        }}
                      ></div>
                    </div>
                    
                    {/* 로딩 상태 표시 */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 px-6 py-4 rounded-xl shadow-lg">
                        <div className="flex items-center space-x-3">
                          <FaSpinner className="text-pink-500 text-2xl animate-spin" />
                          <p className="text-gray-800 dark:text-gray-200 font-medium">
                            {isProcessing ? '텍스트 추출 중...' : '이미지 스캔 중...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : imagePreview ? (
                  <div className="relative border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden h-64 group bg-white dark:bg-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={imagePreview} 
                        alt="증명 이미지 미리보기" 
                        className="max-w-full max-h-full object-contain p-2"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setProofImage(null);
                          setImagePreview(null);
                          setScanComplete(false);
                          setExtractedInfo({});
                        }}
                        className="bg-red-500 text-white rounded-full p-3 transform hover:scale-110 transition-transform shadow-lg border-none"
                      >
                        <FaTimes size={18} />
                      </button>
                    </div>
                    
                    {scanComplete && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
                        <FaCheck size={14} />
                      </div>
                    )}
                    
                    {/* 추출된 정보 표시 */}
                    {Object.keys(extractedInfo).length > 0 && (
                      <div className="absolute bottom-3 left-3 right-3 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-3 rounded-lg shadow-lg space-y-1">
                        {(extractedInfo.location || extractedInfo.parentLocation) && (
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            <span className="font-medium">지역:</span> {formatLocation(extractedInfo.location || '', extractedInfo.parentLocation)}
                          </p>
                        )}
                        {extractedInfo.storeName && (
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            <span className="font-medium">상호명:</span> {extractedInfo.storeName}
                          </p>
                        )}
                        {extractedInfo.date && (
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            <span className="font-medium">날짜:</span> {extractedInfo.date}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => proofImageInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="bg-pink-50 dark:bg-pink-900 rounded-full p-5 mb-4 group-hover:bg-pink-100 dark:group-hover:bg-pink-800 transition-colors">
                      <FaUpload className="text-pink-500 text-3xl" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">클릭하여 이미지 업로드</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">JPG, PNG, WEBP (최대 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={proofImageInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleProofFileChange}
                />
              </div>
            </div>

            {/* 나머지 폼 필드들... */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">여행지</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  placeholder="방문한 여행지를 입력하세요"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  placeholder="리뷰 제목을 입력하세요"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[150px] transition-colors"
                placeholder="여행 경험을 자세히 공유해주세요"
                required
              />
            </div>
            
            {/* 평점 선택 */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">평점</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl focus:outline-none transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    style={{ border: 'none', background: 'transparent', padding: 0 }}
                  >
                    <FaStar />
                  </button>
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-300">{rating}/5</span>
              </div>
            </div>
            
            {/* 리뷰 이미지 업로드 영역 */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                <div className="flex items-center">
                  <span>리뷰 이미지</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">(첫 번째 이미지가 썸네일로 사용됩니다)</span>
                </div>
              </label>
              
              <div className="mt-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {reviewImagePreviews.map((preview, index) => (
                    <div 
                      key={index} 
                      className={`relative border ${index === 0 ? 'border-pink-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl overflow-hidden aspect-square bg-white dark:bg-gray-900 group`}
                    >
                      <img 
                        src={preview} 
                        alt={`리뷰 이미지 ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-md">
                          썸네일
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeReviewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity border-none"
                        aria-label="이미지 제거"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {reviewImagePreviews.length < 5 && (
                    <div
                      onClick={() => reviewImagesInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="bg-pink-50 dark:bg-pink-900 rounded-full p-3 mb-2 group-hover:bg-pink-100 dark:group-hover:bg-pink-800 transition-colors">
                        <FaImage className="text-pink-500 text-xl" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">이미지 추가</p>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  ref={reviewImagesInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleReviewImagesChange}
                  multiple
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium border-none"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-pink-500 text-white rounded-xl shadow-sm hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none"
                disabled={!proofImage}
              >
                리뷰 작성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 