'use client'

import { useState, useEffect } from 'react';
import { Box, Container, Heading, Image, Text } from '@chakra-ui/react'
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa'
import CategorySlider from './CategorySlider'
import useThemeMode from '@/hooks/useDarkMode';

// 카테고리와 지역을 매핑하는 데이터
const categoryRegionMapping = {
  1: [1, 5, 7], // 한적한 시골 -> 서울, 강원도, 통영
  2: [2, 6, 8], // 절친 이야기 -> 부산, 전주, 여수
  3: [3, 5, 7], // 최고의 전망 -> 제주, 강원도, 통영
  4: [4, 6], // 한옥 -> 경주, 전주
  5: [3, 5], // 국립공원 -> 제주, 강원도
  6: [4, 6], // 정적 공간 -> 경주, 전주
  7: [2, 8], // 맛집 수영장 -> 부산, 여수
  8: [2, 3, 7, 8], // 해변 바로 앞 -> 부산, 제주, 통영, 여수
  9: [3, 7], // 섬 -> 제주, 통영
  10: [1, 3], // 기상천외한 숙소 -> 서울, 제주
  11: [5], // 캠핑 -> 강원도
  12: [5, 6], // 통나무집 -> 강원도, 전주
  13: [3, 4], // 동굴 -> 제주, 경주
  14: [1, 2] // 조소형 주택 -> 서울, 부산
};

const regions = [
  {
    id: 1,
    name: '서울',
    description: '현대와 전통이 공존하는 대한민국의 수도',
    image: '/images/seoul.jpg',
    category: 'AI 추천 코스',
    rating: 4.8,
    reviews: 128
  },
  {
    id: 2,
    name: '부산',
    description: '해변과 산이 어우러진 대한민국 제2의 도시',
    image: '/images/busan.png',
    category: 'AI 추천 코스',
    rating: 4.7,
    reviews: 96
  },
  {
    id: 3,
    name: '제주',
    description: '아름다운 자연과 독특한 문화가 있는 섬',
    image: '/images/jeju.png',
    category: 'AI 추천 코스',
    rating: 4.9,
    reviews: 156
  },
  {
    id: 4,
    name: '경주',
    description: '천년 고도의 역사와 문화를 간직한 도시',
    image: '/images/gyeongju.jpg',
    category: 'AI 추천 코스',
    rating: 4.6,
    reviews: 84
  },
  {
    id: 5,
    name: '강원도',
    description: '숲과 산, 바다를 모두 즐길 수 있는 자연의 보고',
    image: '/images/gangwon.jpg',
    category: 'AI 추천 코스',
    rating: 4.8,
    reviews: 112
  },
  {
    id: 6,
    name: '전주',
    description: '한옥마을과 맛있는 음식의 도시',
    image: '/images/jeonju.jpg',
    category: 'AI 추천 코스',
    rating: 4.7,
    reviews: 76
  },
  {
    id: 7,
    name: '통영',
    description: '아름다운 남해안의 항구 도시',
    image: '/images/tongyeong.jpg',
    category: 'AI 추천 코스',
    rating: 4.5,
    reviews: 62
  },
  {
    id: 8,
    name: '여수',
    description: '밤바다가 아름다운 남해안의 도시',
    image: '/images/yeosu.jpg',
    category: 'AI 추천 코스',
    rating: 4.7,
    reviews: 86
  }
]

interface RegionSectionProps {
  onFilterClick?: () => void;
}

export default function RegionSection({ onFilterClick }: RegionSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredRegions, setFilteredRegions] = useState(regions);
  const { themeMode } = useThemeMode();
  
  // 다크모드 여부
  const isDarkMode = themeMode === 'dark';

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      // 이미 선택된 카테고리를 다시 클릭하면 선택 해제
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // 선택된 카테고리에 따라 지역 필터링
  useEffect(() => {
    if (selectedCategory === null) {
      // 선택된 카테고리가 없으면 모든 지역 표시
      setFilteredRegions(regions);
    } else {
      // 선택된 카테고리에 해당하는 지역만 필터링
      const regionIds = categoryRegionMapping[selectedCategory as keyof typeof categoryRegionMapping] || [];
      const filtered = regions.filter(region => regionIds.includes(region.id));
      setFilteredRegions(filtered);
    }
  }, [selectedCategory]);

  // 테마에 따른 스타일 결정
  const getSectionStyle = () => {
    return isDarkMode
      ? "py-16 mb-8 -mt-24 bg-black text-white"
      : "py-16 mb-8 -mt-24 bg-white text-gray-800";
  };

  // 테마에 따른 텍스트 스타일 변경
  const getHeadingClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-2xl font-bold text-pink-500";
      case 'light':
        return "text-2xl font-bold text-gray-800";
      case 'dark':
        return "text-2xl font-bold text-white";
      default:
        return "text-2xl font-bold text-pink-500";
    }
  };

  // 테마에 따른 버튼 스타일 변경
  const getButtonClasses = () => {
    switch (themeMode) {
      case 'original':
        return "px-4 py-2 bg-white text-pink-600 border border-pink-200 rounded-md shadow-sm hover:bg-pink-50 transition-colors duration-200 font-medium";
      case 'light':
        return "px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200 font-medium";
      case 'dark':
        return "px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm hover:bg-gray-700 transition-colors duration-200 font-medium";
      default:
        return "px-4 py-2 bg-white text-pink-600 border border-pink-200 rounded-md shadow-sm hover:bg-pink-50 transition-colors duration-200 font-medium";
    }
  };

  // 테마에 따른 카드 스타일 변경
  const getCardClasses = () => {
    switch (themeMode) {
      case 'original':
        return "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300";
      case 'light':
        return "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300";
      case 'dark':
        return "bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300";
      default:
        return "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300";
    }
  };

  // 텍스트 스타일 변경
  const getCardTitleClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-lg font-bold mb-1 text-pink-600";
      case 'light':
        return "text-lg font-bold mb-1 text-gray-800";
      case 'dark':
        return "text-lg font-bold mb-1 text-white";
      default:
        return "text-lg font-bold mb-1 text-pink-600";
    }
  };

  const getCardTextClasses = () => {
    switch (themeMode) {
      case 'original':
        return "flex items-start text-sm text-gray-600";
      case 'light':
        return "flex items-start text-sm text-gray-600";
      case 'dark':
        return "flex items-start text-sm text-gray-300";
      default:
        return "flex items-start text-sm text-gray-600";
    }
  };

  const getEmptyMessageClass = () => {
    return isDarkMode
      ? "text-white"
      : "text-gray-500";
  };

  // 마커 아이콘 색상
  const getMarkerIconClass = () => {
    if (themeMode === 'original') {
      return "text-pink-500";
    } else if (isDarkMode) {
      return "text-white";
    } else {
      return "text-gray-600";
    }
  };

  return (
    <section className={getSectionStyle()}>
      <div className="container mx-auto px-4">
        <CategorySlider 
          onFilterClick={onFilterClick} 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
        
        <div className="flex items-center justify-between mb-6">
          <h2 className={getHeadingClasses()}>
            {selectedCategory 
              ? `${categories.find(c => c.id === selectedCategory)?.name} 추천 여행 코스` 
              : '모든 여행 코스'}
          </h2>
          
          {selectedCategory && (
            <button 
              className={getButtonClasses()}
              onClick={() => setSelectedCategory(null)}
            >
              모두 보기
            </button>
          )}
        </div>
        
        {filteredRegions.length === 0 ? (
          <div className="text-center py-10">
            <p className={getEmptyMessageClass()}>해당 카테고리에 맞는 여행 코스가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRegions.map((region) => (
              <div key={region.id} className={getCardClasses()}>
                <div className="h-48 overflow-hidden">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className={getCardTitleClasses()}>{region.name}</h3>
                  <div className={`flex items-center mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{region.rating} (리뷰 {region.reviews}개)</span>
                  </div>
                  <div className={getCardTextClasses()}>
                    <FaMapMarkerAlt className={`mt-1 mr-1 flex-shrink-0 ${getMarkerIconClass()}`} />
                    <p>{region.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// CategorySlider에서 사용하는 categories 배열을 여기서도 사용하기 위해 복사
const categories = [
  { id: 1, name: "한적한 시골", icon: "🏡" },
  { id: 2, name: "절친 이야기", icon: "🎫" },
  { id: 3, name: "최고의 전망", icon: "🏞️" },
  { id: 4, name: "한옥", icon: "🏯" },
  { id: 5, name: "국립공원", icon: "🏔️" },
  { id: 6, name: "정적 공간", icon: "🧘" },
  { id: 7, name: "맛집 수영장", icon: "🍽️" },
  { id: 8, name: "해변 바로 앞", icon: "🏖️" },
  { id: 9, name: "섬", icon: "🏝️" },
  { id: 10, name: "기상천외한 숙소", icon: "🏨" },
  { id: 11, name: "캠핑", icon: "⛺" },
  { id: 12, name: "통나무집", icon: "🏡" },
  { id: 13, name: "동굴", icon: "🏞️" },
  { id: 14, name: "조소형 주택", icon: "🏠" },
];