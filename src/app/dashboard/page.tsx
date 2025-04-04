"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaPlus, FaMapMarkedAlt, FaHeart, FaTrash, FaRegCalendarAlt, FaMapMarkerAlt, FaGlobeAsia } from 'react-icons/fa';
import Layout from '@/components/Layout';
import useThemeMode from '@/hooks/useDarkMode';

// 도시별 이미지 매핑 (단일 이미지)
const cityImages: Record<string, string> = {
  '서울': '/images/seoul.jpg',
  '경주': '/images/gyeongju.jpg',
  '강원': '/images/gangwon.jpg',
  '전주': '/images/jeonju.jpg',
  '통영': '/images/tongyeong.jpg',
  '여수': '/images/yeosu.jpg',
  '제주도': '/images/jeju.png',
  '강원도': '/images/kangwon.png',
};

// 여러 이미지가 있는 도시 매핑
const multipleImages: Record<string, string[]> = {
  '부산': [
    '/images/busan.png', 
    '/images/locations/busan/busan1.jpg', 
    '/images/locations/busan/busan2.jpg'
  ],
  '제주': [
    '/images/jeju.png',
    '/images/jeju-course.png'
  ]
};

// 도시 이름에 따라 이미지 URL을 반환하는 함수
const getCityImage = (destination: string): string => {
  if (!destination) return "/images/hero-bg.png";
  
  // 도시 이름이 정확히 일치하는 경우 (여러 이미지 중 랜덤)
  if (multipleImages[destination]) {
    const images = multipleImages[destination];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }
  
  // 도시 이름이 정확히 일치하는 경우 (단일 이미지)
  if (cityImages[destination]) {
    return cityImages[destination];
  }

  // 도시 이름이 포함된 경우 (여러 이미지 중 랜덤)
  for (const [city, images] of Object.entries(multipleImages)) {
    if (destination.toLowerCase().includes(city.toLowerCase())) {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }
  }

  // 도시 이름이 포함된 경우 (단일 이미지)
  for (const [city, image] of Object.entries(cityImages)) {
    if (destination.toLowerCase().includes(city.toLowerCase())) {
      return image;
    }
  }

  // 기본 이미지 반환
  return "/images/hero-bg.png";
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [travelPlans, setTravelPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPlans, setLikedPlans] = useState<Record<string, boolean>>({});
  const { themeMode } = useThemeMode();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    // localStorage에서 여행 계획 데이터 가져오기
    if (typeof window !== 'undefined') {
      try {
        const savedPlans = localStorage.getItem('travelPlans');
        if (savedPlans) {
          setTravelPlans(JSON.parse(savedPlans));
        }

        // 좋아요 상태 가져오기
        const savedLikes = localStorage.getItem('likedTravelPlans');
        if (savedLikes) {
          setLikedPlans(JSON.parse(savedLikes));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('여행 계획 로드 중 오류 발생:', error);
        setIsLoading(false);
      }
    }
  }, [status, router]);

  // 여행 계획 삭제 함수
  const deleteTravelPlan = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    
    if (confirm('이 여행 계획을 삭제하시겠습니까?')) {
      try {
        const savedPlans = localStorage.getItem('travelPlans');
        if (savedPlans) {
          const plans = JSON.parse(savedPlans);
          const filteredPlans = plans.filter((plan: any) => plan.id !== planId);
          localStorage.setItem('travelPlans', JSON.stringify(filteredPlans));
          setTravelPlans(filteredPlans);
        }
      } catch (error) {
        console.error('여행 계획 삭제 중 오류 발생:', error);
      }
    }
  };

  // 좋아요 토글 함수
  const toggleLike = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    
    const newLikedPlans = { ...likedPlans };
    newLikedPlans[planId] = !newLikedPlans[planId];
    setLikedPlans(newLikedPlans);
    
    // localStorage에 좋아요 상태 저장
    localStorage.setItem('likedTravelPlans', JSON.stringify(newLikedPlans));
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  // 테마별 배경 스타일
  const getBgClasses = () => {
    switch (themeMode) {
      case 'original':
        return "py-12 bg-white bg-gradient-to-b from-pink-50 to-white min-h-screen relative overflow-hidden";
      case 'light':
        return "py-12 bg-gray-50 bg-gradient-to-b from-blue-50 to-white min-h-screen relative overflow-hidden";
      case 'dark':
      default:
        return "py-12 bg-gray-900 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen relative overflow-hidden";
    }
  };

  // 테마별 배경 스타일
  const getBgStyles = () => {
    switch (themeMode) {
      case 'original':
        return {
          background: 'linear-gradient(to bottom, #fdf2f8, #ffffff)',
          minHeight: '100vh'
        };
      case 'light':
        return {
          background: 'linear-gradient(to bottom, #eff6ff, #ffffff)',
          minHeight: '100vh'
        };
      case 'dark':
      default:
        return {
          background: 'linear-gradient(to bottom, #111827, #1f2937)',
          minHeight: '100vh'
        };
    }
  };

  // 테마별 카드 스타일
  const getCardClasses = () => {
    switch (themeMode) {
      case 'original':
        return "bg-white rounded-2xl overflow-hidden cursor-pointer shadow-xl border-2 border-pink-200 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl flex flex-col h-full";
      case 'light':
        return "bg-white rounded-2xl overflow-hidden cursor-pointer shadow-xl border-2 border-blue-200 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl flex flex-col h-full";
      case 'dark':
        return "bg-gray-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-gray-700 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl flex flex-col h-full";
      default:
        return "bg-white dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl flex flex-col h-full";
    }
  };

  // 테마별 빈 상태 카드 스타일
  const getEmptyCardClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-center py-16 bg-white max-w-md mx-auto rounded-2xl shadow-xl border-2 border-pink-200";
      case 'light':
        return "text-center py-16 bg-white max-w-md mx-auto rounded-2xl shadow-xl border-2 border-blue-200";
      case 'dark':
        return "text-center py-16 bg-gray-800 max-w-md mx-auto rounded-2xl shadow-md border border-gray-700";
      default:
        return "text-center py-16 bg-white dark:bg-gray-800 max-w-md mx-auto rounded-2xl shadow-md border border-gray-100 dark:border-gray-700";
    }
  };

  // 테마별 하이라이트 텍스트
  const getHighlightTextClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-sm font-bold mb-3 text-pink-700";
      case 'light':
        return "text-sm font-bold mb-3 text-blue-700";
      case 'dark':
        return "text-sm font-bold mb-3 text-gray-200";
      default:
        return "text-sm font-bold mb-3 text-gray-800 dark:text-gray-200";
    }
  };

  // 테마별 하이라이트 태그 스타일
  const getTagClasses = (isDark: boolean) => {
    if (isDark) {
      return "px-3 py-1 bg-teal-900 text-teal-200 text-xs rounded-full shadow-sm border-none";
    }
    
    switch (themeMode) {
      case 'original':
        return "px-3 py-1 bg-pink-50 text-pink-700 text-xs rounded-full shadow-sm border-none";
      case 'light':
        return "px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full shadow-sm border-none";
      default:
        return "px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full shadow-sm border-none";
    }
  };

  // 테마별 구분선
  const getHrClasses = () => {
    switch (themeMode) {
      case 'original':
        return "border-pink-100";
      case 'light':
        return "border-blue-100";
      case 'dark':
        return "border-gray-700";
      default:
        return "border-gray-100 dark:border-gray-700";
    }
  };

  // 테마별 텍스트 스타일
  const getTextClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-5xl font-extrabold tracking-tight text-pink-600 drop-shadow-lg mb-2";
      case 'light':
        return "text-5xl font-extrabold tracking-tight text-gray-800 drop-shadow-lg mb-2";
      case 'dark':
      default:
        return "text-5xl font-extrabold tracking-tight text-white drop-shadow-lg mb-2";
    }
  };

  // 테마별 설명 텍스트 스타일
  const getDescriptionClasses = () => {
    switch (themeMode) {
      case 'original':
        return "text-lg text-pink-700 max-w-lg font-medium";
      case 'light':
        return "text-lg text-gray-700 max-w-lg font-medium";
      case 'dark':
      default:
        return "text-lg text-gray-100 max-w-lg font-medium";
    }
  };

  // 테마별 구분선 스타일
  const getDividerClasses = () => {
    switch (themeMode) {
      case 'original':
        return "w-20 h-1.5 bg-pink-500 rounded-full mb-6";
      case 'light':
        return "w-20 h-1.5 bg-blue-500 rounded-full mb-6";
      case 'dark':
      default:
        return "w-20 h-1.5 bg-pink-500 rounded-full mb-6";
    }
  };

  // 테마별 버튼 스타일
  const getButtonClasses = () => {
    switch (themeMode) {
      case 'original':
        return "mt-4 px-8 py-4 bg-pink-500 border-none text-white rounded-full font-bold flex items-center shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md";
      case 'light':
        return "mt-4 px-8 py-4 bg-pink-500 border-none text-white rounded-full font-bold flex items-center shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md";
      case 'dark':
      default:
        return "mt-4 px-8 py-4 bg-pink-500 border-none text-white rounded-full font-bold flex items-center shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md";
    }
  };

  // 테마별 배경 효과 스타일
  const getEffectClasses = (position: 'top' | 'bottom') => {
    if (position === 'top') {
      switch (themeMode) {
        case 'original':
          return "absolute -top-12 -left-12 w-52 h-52 rounded-full bg-pink-300 opacity-20 z-0 blur-2xl";
        case 'light':
          return "absolute -top-12 -left-12 w-52 h-52 rounded-full bg-blue-300 opacity-20 z-0 blur-2xl";
        case 'dark':
        default:
          return "absolute -top-12 -left-12 w-52 h-52 rounded-full bg-pink-500 opacity-20 z-0 blur-2xl";
      }
    } else {
      switch (themeMode) {
        case 'original':
          return "absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-purple-300 opacity-20 z-0 blur-2xl";
        case 'light':
          return "absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-indigo-300 opacity-20 z-0 blur-2xl";
        case 'dark':
        default:
          return "absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-yellow-400 opacity-20 z-0 blur-2xl";
      }
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <Layout>
        <div className="py-10 bg-blue-50 dark:bg-gray-900 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-10">
              <div className="space-y-3">
                <div className="h-10 w-52 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-5 w-80 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[380px] bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div 
        className={getBgClasses()} 
        style={getBgStyles()}
      >
        {/* 배경 장식 요소 */}
        <div className={getEffectClasses('top')}></div>
        <div className={getEffectClasses('bottom')}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 상단 여백 추가 */}
          <div className="pt-16 md:pt-24"></div>
          
          <div className="flex flex-col items-center mb-12 text-center space-y-6">
            <h1 className={getTextClasses()}>
              나의 여행 계획
            </h1>
            <div className={getDividerClasses()}></div>
            <p className={getDescriptionClasses()}>
              {session?.user?.name 
                ? session.user.name 
                : (session?.user?.email?.includes('google_') 
                    ? '사용자' 
                    : (session?.user?.email || '사용자'))}님의 여행 계획 모음입니다. 새로운 여행을 계획하고 추억을 관리하세요.
            </p>
            <button
              onClick={() => router.push('/travel/create')}
              className={getButtonClasses()}
            >
              <FaPlus className="mr-2" />
              새 여행 계획 만들기
            </button>
          </div>

          {travelPlans.length > 0 ? (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0"
            >
              {travelPlans.map((plan: any) => (
                <div 
                  key={plan.id} 
                  className={getCardClasses()}
                  onClick={() => router.push(`/travel/${plan.id}`)}
                >
                  <div className="relative w-full aspect-[4/3]">
                    <img
                      src={getCityImage(plan.destination || '')}
                      alt={plan.destination || '여행지'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0"
                    ></div>
                    <div
                      className="absolute top-4 right-4 z-10"
                    >
                      <span 
                        className="px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full shadow-md border-none"
                      >
                        {plan.travelStyle || '여행 스타일'}
                      </span>
                    </div>
                    <div
                      className="absolute bottom-4 left-4 right-4 z-10"
                    >
                      <div className="flex items-center mb-1">
                        <FaMapMarkerAlt className="text-white mr-2 flex-shrink-0" />
                        <h3 
                          className="text-white text-xl md:text-2xl font-extrabold tracking-wide drop-shadow-md truncate"
                        >
                          {plan.destination || '여행지'}
                        </h3>
                      </div>
                      <div className="flex items-center text-white opacity-90">
                        <FaRegCalendarAlt className="mr-2 text-sm flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="space-y-5 h-full flex flex-col">
                      <div>
                        <h4 className={getHighlightTextClasses()}>
                          여행 하이라이트
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const firstDay = Object.values(plan.recommendations?.schedule || {})[0] as { spots?: any[] } | undefined;
                            const spots = firstDay?.spots || [];
                            
                            return spots.length > 0 
                              ? spots.slice(0, 3).map((spot: any, idx: number) => (
                                  <span 
                                    key={idx}
                                    className={getTagClasses(plan.recommendations && plan.recommendations.schedule[spot.id]?.isDark)}
                                  >
                                    {spot?.category_name?.split(' > ').pop() || '관광지'}
                                  </span>
                                ))
                              : ['자연', '음식', '문화'].map((tag) => (
                                  <span 
                                    key={tag}
                                    className={getTagClasses(false)}
                                  >
                                    {tag}
                                  </span>
                                ));
                          })()}
                        </div>
                      </div>
                      
                      <hr className={getHrClasses()} />
                      
                      <div className="flex justify-between items-center mt-auto">
                        {plan.recommendations && (
                          <span 
                            className="px-3 py-1 bg-purple-500 text-white text-xs rounded-full shadow-sm border-none"
                          >
                            AI 추천
                          </span>
                        )}
                        <div className="flex space-x-3">
                          <button
                            aria-label="좋아요"
                            className="p-2 text-gray-400 bg-transparent rounded-full hover:text-red-500 transition-all duration-200 border-none focus:outline-none"
                            onClick={(e) => toggleLike(e, plan.id)}
                          >
                            <FaHeart className={likedPlans[plan.id] ? "text-red-500" : ""} />
                          </button>
                          <button
                            aria-label="삭제"
                            className="p-2 text-gray-400 rounded-full hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 border-none focus:outline-none"
                            onClick={(e) => deleteTravelPlan(e, plan.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={getEmptyCardClasses()}>
              <FaGlobeAsia className="mx-auto text-gray-400 mb-6 text-6xl dark:text-gray-500" />
              <h2 
                className="text-xl font-bold text-gray-800 dark:text-white mb-3"
              >
                아직 여행 계획이 없어요
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 px-6">
                새로운 여행 계획을 만들어 소중한 추억을 기록해보세요!
              </p>
              <button
                onClick={() => router.push('/travel/create')}
                className="px-8 py-3 bg-pink-500 text-white rounded-full font-bold flex items-center mx-auto shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md border-none"
              >
                <FaPlus className="mr-2" />
                여행 계획 만들기
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}