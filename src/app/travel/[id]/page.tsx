"use client";

import React, { useState, useEffect, use } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaWallet, FaMapMarkerAlt, FaBed, FaUtensils, FaWalking, FaSubway, FaHeart, FaRegEdit, FaShareAlt, FaTrash, FaCoffee, FaMoon, FaSun, FaChevronLeft, FaChevronRight, FaMapMarkedAlt, FaInfoCircle } from 'react-icons/fa'
import { useRouter, useParams } from 'next/navigation'
import Layout from '../../../components/Layout'
import Link from 'next/link'
import Image from 'next/image';
import { getCityImage } from '@/utils/imageUtils';
import useDarkMode from '@/hooks/useDarkMode';

interface TravelPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  travelStyle: string;
  duration?: string;
  interests?: string;
  preferences?: string;
  image?: string;
  createdAt?: string;
  recommendations?: {
    schedule: Record<string, {
      date?: string;
      spots: Array<{
        title?: string;
        name?: string;
        addr1?: string;
        addr2?: string;
        address?: string;
        category_name?: string;
        category_code?: string;
        type?: string;
        latitude?: number;
        longitude?: number;
        image?: string;
        description?: string;
      }>;
      accommodation?: {
        name: string;
        addr1: string;
        addr2?: string;
      };
    }>;
    message?: string;
    overview?: string;
  };
}

// 날짜를 한글 형식으로 포맷팅하는 함수
const formatDateKorean = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
};

// 날짜 차이를 계산하는 함수 (일 수)
const getDaysDifference = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // 시작일 포함
};

// 카테고리에 따른 아이콘 반환
const getCategoryIcon = (category?: string) => {
  if (!category) return <FaMapMarkerAlt className="text-blue-500" />;
  
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('식당') || lowerCategory.includes('음식')) {
    return <FaUtensils className="text-orange-500" />;
  } else if (lowerCategory.includes('카페') || lowerCategory.includes('커피')) {
    return <FaCoffee className="text-amber-700" />;
  } else if (lowerCategory.includes('숙소') || lowerCategory.includes('호텔') || lowerCategory.includes('리조트')) {
    return <FaBed className="text-indigo-500" />;
  } else if (lowerCategory.includes('쇼핑') || lowerCategory.includes('시장')) {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>;
  } else if (lowerCategory.includes('문화') || lowerCategory.includes('박물관') || lowerCategory.includes('미술관')) {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a1 1 0 00-.845.63l-7 14a1 1 0 00.894 1.37h14a1 1 0 00.894-1.37l-7-14A1 1 0 0010 2zm1 15H9v-2h2v2zm0-4H9V7h2v6z" clipRule="evenodd" />
    </svg>;
  } else if (lowerCategory.includes('자연') || lowerCategory.includes('공원')) {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.382 1.992a.9.9 0 0 0-1.357 0l-1.5 1.5a.9.9 0 0 0 0 1.357l1.5 1.5a.9.9 0 0 0 1.357 0l1.5-1.5a.9.9 0 0 0 0-1.357l-1.5-1.5zM12 3.1c-3.314 0-6 2.686-6 6 0 1.81.804 3.433 2.073 4.53a.77.77 0 0 0-.073.37c0 .414.336.75.75.75h6.5c.414 0 .75-.336.75-.75a.77.77 0 0 0-.073-.37A5.981 5.981 0 0 0 18 9.1c0-3.314-2.686-6-6-6z" clipRule="evenodd" />
    </svg>;
  } else if (lowerCategory.includes('해변') || lowerCategory.includes('바다') || lowerCategory.includes('해수욕장')) {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.947 12.243A9.97 9.97 0 0 1 10 11c2.186 0 4.239.636 5.947 1.721a.8.8 0 0 1 .053 1.306 11.99 11.99 0 0 1-12 0 .8.8 0 0 1 .053-1.306zM10 16.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5zm-5-3.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clipRule="evenodd" />
    </svg>;
  } else if (lowerCategory.includes('산') || lowerCategory.includes('등산')) {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.47 1.72a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 01-1.06-1.06l3.97-3.97H3.75a.75.75 0 010-1.5h11.69L11.47 2.78a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>;
  } else if (lowerCategory.includes('교통') || lowerCategory.includes('터미널')) {
    return <FaSubway className="text-slate-500" />;
  } else {
    return <FaWalking className="text-blue-500" />;
  }
};

export default function TravelPlanDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>('1');
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  useEffect(() => {
    // localStorage에서 여행 계획 데이터 불러오기
    if (typeof window !== 'undefined') {
      try {
        const savedPlans = localStorage.getItem('travelPlans');
        if (savedPlans) {
          const plans = JSON.parse(savedPlans);
          const currentPlan = plans.find((p: TravelPlan) => p.id === id);
          
          if (currentPlan) {
            setPlan(currentPlan);
            console.log("로드된 여행 계획:", currentPlan);
            
            // 첫 번째 날짜를 기본 활성화
            if (currentPlan.recommendations?.schedule) {
              const scheduleKeys = Object.keys(currentPlan.recommendations.schedule);
              if (scheduleKeys.length > 0) {
                // day_1, day_2 형식이나 1, 2, 3 형식 모두 처리
                const firstDayKey = scheduleKeys[0].includes('day_') 
                  ? scheduleKeys[0].replace('day_', '') 
                  : scheduleKeys[0];
                setActiveDay(firstDayKey);
              }
            }
            
            // 데이터 로드 완료 후 로딩 상태 종료
            setIsLoading(false);
          } else {
            // 계획을 찾지 못한 경우
            console.log('여행 계획을 찾을 수 없습니다.');
            setIsLoading(false);
          }
        } else {
          // 저장된 여행 계획이 없는 경우
          console.log('저장된 여행 계획이 없습니다.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('여행 계획 로드 중 오류 발생:', error);
        setIsLoading(false);
      }
    }
    
    // 5초 후에도 로딩이 계속되면 강제로 로딩 상태 종료 (안전장치)
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => clearTimeout(loadingTimeout);
  }, [id]);

  // 여행 계획 삭제 함수
  const handleDelete = () => {
    if (confirm('이 여행 계획을 삭제하시겠습니까?')) {
      try {
        const savedPlans = localStorage.getItem('travelPlans');
        if (savedPlans) {
          const plans = JSON.parse(savedPlans);
          const filteredPlans = plans.filter((p: TravelPlan) => p.id !== id);
          localStorage.setItem('travelPlans', JSON.stringify(filteredPlans));
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('여행 계획 삭제 중 오류 발생:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 w-40 bg-gray-200 rounded mb-8"></div>
              <div className="h-64 w-full bg-gray-200 rounded-xl mb-8"></div>
              <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-8"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-40 bg-gray-200 rounded-lg"></div>
                <div className="h-40 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!plan) {
    return (
      <Layout>
        <div className="py-10 bg-black dark:bg-white min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="py-16">
              <h1 className="text-3xl font-bold text-white dark:text-black mb-4">
                여행 계획을 찾을 수 없습니다
              </h1>
              <p className="text-gray-400 dark:text-gray-600 mb-8">
                요청하신 여행 계획이 존재하지 않거나 삭제되었습니다.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-lg font-medium"
              >
                여행 계획 목록으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 여행 일수 계산
  const totalDays = getDaysDifference(plan.startDate, plan.endDate);
  
  // 일정 데이터 키 포맷 확인 및 변환 함수
  const formatScheduleKey = (key: string) => {
    // day_1 형식이면 1만 추출
    if (key.includes('day_')) {
      return key.replace('day_', '');
    }
    return key;
  };
  
  // 일정 데이터 키 생성 함수 (역변환)
  const getScheduleKey = (day: string) => {
    // 일정 데이터가 day_1 형식이면 그대로 사용
    if (plan?.recommendations?.schedule && 
        Object.keys(plan.recommendations.schedule)[0]?.includes('day_')) {
      return `day_${day}`;
    }
    return day;
  };
  
  return (
    <Layout>
      <div className="bg-black dark:bg-white min-h-screen transition-colors duration-300">
        {/* 뒤로가기 버튼 - 헤더 상단에 고정 */}
        <div className="sticky top-0 z-10 bg-black/90 dark:bg-white/90 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-3 py-2 flex items-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-sm font-medium text-blue-400 dark:text-blue-600 hover:text-blue-300 dark:hover:text-blue-700 transition-colors"
            >
              <FaArrowLeft className="mr-1.5" />
              <span>여행 계획 목록으로 돌아가기</span>
            </button>
          </div>
        </div>

        {/* 헤더 섹션 - 높이 줄임 */}
        <div className="relative h-60 w-full">
          <div className="absolute inset-0">
            <img
              src={plan.image || getCityImage(plan.destination || '')}
              alt={plan.destination}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/50"></div>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center p-4 md:p-6 text-white">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-lg mb-2 text-white">
                {plan.destination || '여행지'}
              </h1>
              <div className="flex items-center mt-2 space-x-3">
                <div className="flex items-center text-sm bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                  <FaCalendarAlt className="mr-1.5 text-base text-pink-300" />
                  <span className="text-white drop-shadow-md">{formatDateKorean(plan.startDate)} - {formatDateKorean(plan.endDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
              <div className="flex gap-1.5">
                <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-pink-400 text-white text-xs font-bold rounded-full shadow-md">
                  {plan.travelStyle || '여행 스타일'}
                </span>
                {plan?.recommendations && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-400 text-white text-xs font-bold rounded-full shadow-md">
                    AI 추천
                  </span>
                )}
              </div>
              
              <div className="flex gap-1.5">
                <button
                  className="p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors shadow-md border-none"
                  aria-label="좋아요"
                >
                  <FaHeart className="text-pink-300 text-base" />
                </button>
                <button
                  className="p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors shadow-md border-none"
                  aria-label="다크모드 토글"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? (
                    <FaSun className="text-yellow-300 text-base" />
                  ) : (
                    <FaMoon className="text-gray-200 text-base" />
                  )}
                </button>
                <button
                  className="p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors shadow-md border-none"
                  aria-label="수정"
                  onClick={() => router.push(`/travel/edit/${id}`)}
                >
                  <FaRegEdit className="text-base" />
                </button>
                <button
                  className="p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors shadow-md border-none"
                  aria-label="공유"
                >
                  <FaShareAlt className="text-base" />
                </button>
                <button
                  className="p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors shadow-md border-none"
                  aria-label="삭제"
                  onClick={handleDelete}
                >
                  <FaTrash className="text-base" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 메인 콘텐츠 - 여백 줄임 */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-5">
          {/* 여행 개요 */}
          {plan?.recommendations?.overview && (
            <div className="bg-gray-900 dark:bg-white p-4 rounded-xl shadow-md mb-5 border border-gray-800 dark:border-gray-200">
              <h2 className="text-lg font-bold mb-3 text-white dark:text-black">
                여행 개요
              </h2>
              <p className="text-gray-300 dark:text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                {plan.recommendations.overview}
              </p>
            </div>
          )}
          
          {/* 일정 탭 */}
          <div className="mb-4 flex overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex space-x-1.5">
              {Array.from({ length: totalDays }, (_, i) => {
                const dayKey = (i + 1).toString();
                return (
                  <button
                    key={dayKey}
                    className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${
                      activeDay === dayKey
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                        : 'bg-gray-800 text-white dark:bg-gray-100 dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 border-none dark:border-none'
                    }`}
                    onClick={() => setActiveDay(dayKey)}
                  >
                    {i + 1}일차
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* 일정 상세 */}
          <div className="bg-gray-900 dark:bg-white rounded-xl shadow-md overflow-hidden border border-gray-800 dark:border-gray-200">
            {plan?.recommendations?.schedule && 
             (plan.recommendations.schedule[activeDay] || 
              plan.recommendations.schedule[`day_${activeDay}`]) ? (
              <div>
                <div className="p-4 border-b border-gray-800 dark:border-gray-200 bg-gray-800 dark:bg-gray-100">
                  <h3 className="text-lg font-bold text-white dark:text-black flex items-center">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white dark:bg-blue-500 mr-2 text-sm shadow-md">
                      {activeDay}
                    </span>
                    <span>
                      일차 일정 
                      {(plan.recommendations?.schedule?.[activeDay]?.date || 
                        plan.recommendations?.schedule?.[`day_${activeDay}`]?.date) && 
                        ` - ${plan.recommendations?.schedule?.[activeDay]?.date || 
                             plan.recommendations?.schedule?.[`day_${activeDay}`]?.date}`}
                    </span>
                  </h3>
                </div>
                
                <div className="p-4">
                  {/* 가로 스크롤 타임라인으로 변경 - 카드 크기 축소 */}
                  <div className="flex items-start overflow-x-auto pb-3 space-x-3 scrollbar-hide">
                    {/* 올바른 키로 일정 데이터 접근 */}
                    {(plan.recommendations?.schedule?.[activeDay]?.spots || 
                      plan.recommendations?.schedule?.[`day_${activeDay}`]?.spots || [])
                      .map((spot, index) => (
                      <div key={index} className="flex-shrink-0 w-72 rounded-xl bg-gray-800 dark:bg-white shadow-md overflow-hidden border border-gray-700 dark:border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
                        {/* 아이콘 중심 카드 헤더 */}
                        <div className="p-3 border-b border-gray-700 dark:border-gray-200 bg-gray-800 dark:bg-gray-100 flex items-center">
                          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 dark:bg-gray-200 shadow-sm">
                            <div className="text-xl">
                              {getCategoryIcon(spot.category_name)}
                            </div>
                          </div>
                          <div className="ml-2.5 flex-1">
                            <h4 className="text-base font-bold text-white dark:text-black truncate">
                              {spot.title || spot.name}
                            </h4>
                            {spot.category_name && (
                              <p className="text-xs text-gray-400 dark:text-gray-600">
                                {spot.category_name.split(' > ').pop()}
                              </p>
                            )}
                          </div>
                          <div className="ml-auto">
                            <span className="inline-block px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full shadow-md font-bold">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        
                        {/* 카드 본문 */}
                        <div className="p-3 bg-gray-800 dark:bg-white">
                          {/* 주소 */}
                          {(spot.address || spot.addr1) && (
                            <p className="text-xs text-gray-300 dark:text-gray-700 mb-2 flex items-start">
                              <FaMapMarkerAlt className="mr-1 text-red-500 dark:text-red-600 mt-0.5 flex-shrink-0 text-sm" />
                              <span className="line-clamp-2 text-white dark:text-black">
                                {spot.address || `${spot.addr1} ${spot.addr2 || ''}`}
                              </span>
                            </p>
                          )}
                          
                          {/* 설명 */}
                          {spot.description && (
                            <div className="mt-2 bg-gray-700 dark:bg-gray-100 p-2 rounded-md border border-gray-600 dark:border-gray-300">
                              <p className="text-gray-300 dark:text-gray-700 text-xs line-clamp-3 leading-relaxed">
                                {spot.description}
                              </p>
                            </div>
                          )}

                          {/* 추가 정보 아이콘으로 표시 */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {spot.category_name?.toLowerCase().includes('식당') && (
                              <div className="flex items-center px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-md text-xs">
                                <FaUtensils className="mr-0.5 text-xs" />
                                <span>식당</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('카페') && (
                              <div className="flex items-center px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-md text-xs">
                                <FaCoffee className="mr-0.5 text-xs" />
                                <span>카페</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('쇼핑') && (
                              <div className="flex items-center px-1.5 py-0.5 bg-pink-100 text-pink-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>쇼핑</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('자연') && (
                              <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <span>자연</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('문화') && (
                              <div className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8M12 8v13m0-13V6a4 4 0 014-4h.2" />
                                </svg>
                                <span>문화</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('해변') && (
                              <div className="flex items-center px-2 py-1 bg-cyan-100 text-cyan-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>해변</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('관광') && (
                              <div className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                                <FaWalking className="h-3 w-3 mr-1" />
                                <span>관광</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('공원') && (
                              <div className="flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <span>공원</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('축제') && (
                              <div className="flex items-center px-2 py-1 bg-rose-100 text-rose-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                                <span>축제</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('시장') && (
                              <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>시장</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('야경') && (
                              <div className="flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                <span>야경</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('체험') && (
                              <div className="flex items-center px-2 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>체험</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('전통') && (
                              <div className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                </svg>
                                <span>전통</span>
                              </div>
                            )}
                            {spot.category_name?.toLowerCase().includes('박물관') && (
                              <div className="flex items-center px-2 py-1 bg-teal-100 text-teal-800 rounded-md text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                                <span>박물관</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 가로 스크롤 안내 표시 */}
                  <div className="mt-4 text-center">
                    <p className="text-base font-bold text-white flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      좌우로 스크롤하여 더 많은 장소를 확인하세요
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-medium text-gray-300">
                  {activeDay}일차 일정이 없습니다
                </h3>
                <p className="mt-2 text-base text-gray-400">
                  해당 일자에 대한 일정 정보가 아직 없습니다.
                </p>
              </div>
            )}
          </div>
          
          {/* 숙소 정보 (있는 경우) */}
          {(plan.recommendations?.schedule?.[activeDay]?.accommodation || 
            plan.recommendations?.schedule?.[`day_${activeDay}`]?.accommodation) && (
            <div className="mt-8 bg-gray-800 dark:bg-white p-6 rounded-xl shadow-md border border-gray-700 dark:border-gray-200">
              <h3 className="text-xl font-bold text-white dark:text-black mb-4 flex items-center">
                <FaBed className="mr-2 text-blue-600 dark:text-blue-500" />
                숙소 정보
              </h3>
              <div className="bg-gray-700 dark:bg-gray-100 p-4 rounded-lg border border-gray-600 dark:border-gray-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-gray-600 dark:bg-gray-200 rounded-full">
                    <FaBed className="text-2xl text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-white dark:text-black">
                      {plan.recommendations?.schedule?.[activeDay]?.accommodation?.name || 
                        plan.recommendations?.schedule?.[`day_${activeDay}`]?.accommodation?.name}
                    </h4>
                    <p className="text-sm text-gray-300 dark:text-gray-700 mt-1">
                      {(plan.recommendations?.schedule?.[activeDay]?.accommodation?.addr1 || 
                        plan.recommendations?.schedule?.[`day_${activeDay}`]?.accommodation?.addr1) &&
                        `${plan.recommendations?.schedule?.[activeDay]?.accommodation?.addr1 || 
                          plan.recommendations?.schedule?.[`day_${activeDay}`]?.accommodation?.addr1} 
                          ${plan.recommendations?.schedule?.[activeDay]?.accommodation?.addr2 || 
                            plan.recommendations?.schedule?.[`day_${activeDay}`]?.accommodation?.addr2 || ''}`}
                    </p>
                    
                    {/* 숙소 정보 아이콘 */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="flex items-center px-2 py-1 bg-indigo-100 dark:bg-indigo-200 text-indigo-800 rounded-md text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>숙소</span>
                      </div>
                      {activeDay !== totalDays.toString() && (
                        <div className="flex items-center px-2 py-1 bg-green-100 dark:bg-green-200 text-green-800 rounded-md text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>체크인</span>
                        </div>
                      )}
                      {activeDay === totalDays.toString() && (
                        <div className="flex items-center px-2 py-1 bg-red-100 dark:bg-red-200 text-red-800 rounded-md text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>체크아웃</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}