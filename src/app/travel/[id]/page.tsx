"use client";

import React, { useState, useEffect, use } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaWallet, FaMapMarkerAlt, FaBed, FaUtensils, FaWalking, FaSubway } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Layout from '../../../components/Layout'
import Link from 'next/link'

interface TravelPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelStyle: string;
  interests: string;
  preferences: string;
  recommendations?: {
    dayPlans: Array<{
      day: number;
      activities: Array<{
        time: string;
        title: string;
        description: string;
        location: string;
        duration: string;
        cost: number;
        type: 'attraction' | 'food' | 'hotel' | 'transport';
      }>;
    }>;
    totalCost: number;
    weather: Array<{
      date: string;
      temperature: string;
      condition: string;
    }>;
  };
}

export default function TravelPlanDetail(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        
        // localStorage에서 여행 계획 가져오기
        if (typeof window !== 'undefined') {
          const savedPlansJSON = localStorage.getItem('travelPlans');
          
          if (savedPlansJSON) {
            const savedPlans = JSON.parse(savedPlansJSON);
            const currentPlan = savedPlans.find((p: any) => p.id === params.id);
            
            if (currentPlan) {
              setPlan(currentPlan);
              return;
            }
          }
        }
        
        // localStorage에 없는 경우 모의 데이터 사용 (실제로는 API 호출 대체)
        const mockPlan: TravelPlan = {
          id: params.id,
          destination: '도쿄',
          startDate: '2024-04-01',
          endDate: '2024-04-05',
          budget: 1500000,
          travelStyle: '문화 탐방',
          interests: '역사, 음식, 쇼핑, 현지 체험',
          preferences: '대중교통 이용, 현지 맛집 방문, 주요 관광지 필수',
          recommendations: {
            dayPlans: [
              {
                day: 1,
                activities: [
                  {
                    time: '09:00',
                    title: '도쿄 타워 방문',
                    description: '도쿄의 상징적인 타워에서 도시 전경을 감상하세요.',
                    location: '도쿄 타워, 미나토구',
                    duration: '2시간',
                    cost: 30000,
                    type: 'attraction'
                  },
                  {
                    time: '12:00',
                    title: '츠키지 마켓에서 점심',
                    description: '신선한 해산물과 일본 현지 음식을 맛보세요.',
                    location: '츠키지 마켓, 츄오구',
                    duration: '1시간 30분',
                    cost: 25000,
                    type: 'food'
                  },
                  {
                    time: '14:30',
                    title: '센소지 사원 탐방',
                    description: '도쿄에서 가장 오래된 사원을 방문하고 전통 문화를 체험하세요.',
                    location: '센소지 사원, 아사쿠사',
                    duration: '2시간',
                    cost: 0,
                    type: 'attraction'
                  },
                  {
                    time: '17:00',
                    title: '아키하바라 전자상가 쇼핑',
                    description: '일본의 전자제품과 애니메이션 관련 상품을 구경하세요.',
                    location: '아키하바라, 치요다구',
                    duration: '3시간',
                    cost: 50000,
                    type: 'attraction'
                  },
                  {
                    time: '20:30',
                    title: '신주쿠에서 저녁 식사',
                    description: '번화가 신주쿠에서 맛있는 라멘을 즐겨보세요.',
                    location: '신주쿠, 신주쿠구',
                    duration: '1시간 30분',
                    cost: 20000,
                    type: 'food'
                  }
                ]
              },
              {
                day: 2,
                activities: [
                  {
                    time: '10:00',
                    title: '하라주쿠 거리 탐방',
                    description: '독특한 패션과 카페로 유명한 하라주쿠를 방문하세요.',
                    location: '하라주쿠, 시부야구',
                    duration: '2시간',
                    cost: 15000,
                    type: 'attraction'
                  },
                  {
                    time: '13:00',
                    title: '메이지 신궁 방문',
                    description: '도쿄 중심부에 있는 울창한 숲속의 신성한 신사를 방문하세요.',
                    location: '메이지 신궁, 시부야구',
                    duration: '1시간 30분',
                    cost: 0,
                    type: 'attraction'
                  },
                  {
                    time: '16:00',
                    title: '시부야 스크램블 교차로 & 쇼핑',
                    description: '세계에서 가장 붐비는 교차로를 경험하고 주변 쇼핑을 즐기세요.',
                    location: '시부야, 시부야구',
                    duration: '3시간',
                    cost: 40000,
                    type: 'attraction'
                  }
                ]
              }
            ],
            totalCost: 1500000,
            weather: [
              {
                date: '2024-04-01',
                temperature: '16°C',
                condition: '맑음',
              },
              {
                date: '2024-04-02',
                temperature: '17°C',
                condition: '구름 조금',
              },
              {
                date: '2024-04-03',
                temperature: '19°C',
                condition: '맑음',
              },
              {
                date: '2024-04-04',
                temperature: '16°C',
                condition: '비',
              },
              {
                date: '2024-04-05',
                temperature: '18°C',
                condition: '맑음',
              },
            ],
          },
        };
        setPlan(mockPlan);
      } catch (error) {
        console.error('여행 계획을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [params.id]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction':
        return FaWalking;
      case 'food':
        return FaUtensils;
      case 'hotel':
        return FaBed;
      case 'transport':
        return FaSubway;
      default:
        return FaMapMarkerAlt;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-4xl py-6 px-4">
          <div className="h-[200px] bg-gray-200 animate-pulse rounded-xl mb-6"></div>
          <div className="h-[100px] bg-gray-200 animate-pulse rounded-lg mb-6"></div>
          <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </Layout>
    );
  }

  if (!plan) {
    return (
      <Layout>
        <div className="container mx-auto max-w-4xl py-6 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
            여행 계획을 찾을 수 없습니다.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl py-6 px-4">
        {/* 뒤로가기 버튼 */}
        <div className="mb-4 flex items-center">
          <button 
            className="text-gray-600 hover:text-blue-600 font-medium text-sm flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => router.push('/dashboard')}
          >
            <FaArrowLeft className="text-xs" />
            대시보드로 돌아가기
          </button>
        </div>
      
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="relative h-80 rounded-xl overflow-hidden mb-4">
            <img
              src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3"
              alt={plan.destination}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="px-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 font-['Montserrat'] tracking-tight">{plan.destination} 여행 계획</h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-blue-600 text-sm" />
                <span className="text-sm">
                  {new Date(plan.startDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} - 
                  {new Date(plan.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaWallet className="text-blue-600 text-sm" />
                <span className="text-sm">예산: {plan.budget.toLocaleString()}원</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{plan.travelStyle}</span>
            </div>
          </div>
        </div>

        {/* 탭 섹션 */}
        <div className="mb-6 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 0 ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab(0)}
            >
              일정
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 1 ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab(1)}
            >
              날씨
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 2 ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab(2)}
            >
              비용
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 3 ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab(3)}
            >
              정보
            </button>
          </div>

          <div className="p-4">
            {/* 일정 탭 */}
            {activeTab === 0 && (
              <div className="space-y-5">
                {plan.recommendations?.dayPlans.map((dayPlan) => (
                  <div 
                    key={dayPlan.day} 
                    className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <h3 className="text-lg font-bold mb-4 font-['Montserrat'] pl-3 border-l-2 border-blue-500">
                      Day {dayPlan.day}
                    </h3>
                    <ul className="space-y-4">
                      {dayPlan.activities.map((activity, index) => (
                        <li 
                          key={index} 
                          className="p-3 bg-gray-50 rounded border border-gray-100 shadow-sm hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex justify-between mb-2 items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600">
                                {React.createElement(getActivityIcon(activity.type), { size: 14 })}
                              </span>
                              <span className="font-semibold text-sm">{activity.time}</span>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                              {activity.duration}
                            </span>
                          </div>
                          <h4 className="text-base font-semibold mb-1">
                            {activity.title}
                          </h4>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FaMapMarkerAlt className="text-gray-500 mr-1 text-xs" />
                            <span className="text-xs">{activity.location}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {activity.description}
                          </p>
                          {activity.cost > 0 && (
                            <div className="flex justify-end">
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                예상 비용: {activity.cost.toLocaleString()}원
                              </span>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* 날씨 탭 */}
            {activeTab === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {plan.recommendations?.weather.map((day, index) => (
                  <div 
                    key={index} 
                    className="p-3 border border-gray-200 rounded text-center shadow-sm hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 bg-white"
                  >
                    <p className="font-medium mb-2 text-gray-700 text-xs">
                      {new Date(day.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xl font-bold mb-1 text-blue-600">
                      {day.temperature}
                    </p>
                    <p className="text-gray-600 text-xs font-medium">
                      {day.condition}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 비용 탭 */}
            {activeTab === 2 && (
              <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-4 font-['Montserrat']">예상 총 비용</h3>
                <p className="text-2xl text-blue-600 font-bold mb-2 font-['Montserrat']">
                  {plan.recommendations?.totalCost.toLocaleString()}원
                </p>
                <p className="text-gray-600 text-sm">
                  예산 대비 {((plan.recommendations?.totalCost || 0) / plan.budget * 100).toFixed(1)}% 사용
                </p>
                
                <div className="mt-6">
                  <h4 className="text-base font-semibold mb-3 text-gray-700">비용 내역</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between p-3 border-b border-gray-100">
                      <span className="text-sm font-medium">숙박비</span>
                      <span className="text-sm font-semibold">450,000원</span>
                    </div>
                    <div className="flex justify-between p-3 border-b border-gray-100">
                      <span className="text-sm font-medium">식비</span>
                      <span className="text-sm font-semibold">320,000원</span>
                    </div>
                    <div className="flex justify-between p-3 border-b border-gray-100">
                      <span className="text-sm font-medium">교통비</span>
                      <span className="text-sm font-semibold">180,000원</span>
                    </div>
                    <div className="flex justify-between p-3 border-b border-gray-100">
                      <span className="text-sm font-medium">관광 및 액티비티</span>
                      <span className="text-sm font-semibold">350,000원</span>
                    </div>
                    <div className="flex justify-between p-3 border-b border-gray-100">
                      <span className="text-sm font-medium">쇼핑 및 기타</span>
                      <span className="text-sm font-semibold">200,000원</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 정보 탭 */}
            {activeTab === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded bg-white shadow-sm">
                  <h3 className="text-lg font-medium mb-3 font-['Montserrat']">여행 정보</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-gray-700">관심사</h4>
                      <div className="flex flex-wrap gap-2">
                        {plan.interests.split(', ').map((interest, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-gray-700">특별한 선호사항</h4>
                      <p className="text-sm">{plan.preferences}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded bg-white shadow-sm">
                  <h3 className="text-lg font-medium mb-3 font-['Montserrat']">여행지 정보</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-gray-700">언어</h4>
                      <p className="text-sm">일본어 (기본 영어 가능)</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-gray-700">통화</h4>
                      <p className="text-sm">일본 엔 (JPY)</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-gray-700">시차</h4>
                      <p className="text-sm">한국보다 0시간 (같은 시간대)</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-gray-700">비자</h4>
                      <p className="text-sm">90일 이내 무비자 입국 가능</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            onClick={() => router.push('/dashboard')}
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    </Layout>
  );
} 