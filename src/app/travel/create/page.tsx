"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import usePerformance from '@/hooks/usePerformance';

export default function CreateTravelPlan() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  
  // 필수 정보 관리
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 2 || !destination || !startDate || !endDate || !travelStyle) {
      alert('모든 정보를 입력해주세요.');
      return;
    }
    
    setSubmitting(true);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  // 여행 스타일 선택 옵션
  const travelStyles = [
    { value: 'relax', label: '휴양/힐링', desc: '여유롭게 쉬는 여행' },
    { value: 'nature', label: '자연/풍경', desc: '자연과 함께하는 여행' },
    { value: 'food', label: '맛집 여행', desc: '맛있는 음식을 찾아서' },
    { value: 'activity', label: '액티비티', desc: '활동적인 체험 여행' }
  ];

  // 국내 인기 여행지
  const popularDestinations = [
    '제주도', '강릉', '부산', '여수', '경주', '전주', '속초', '울산'
  ];

  const canProgress = () => {
    switch (step) {
      case 0: return !!destination;
      case 1: return !!startDate && !!endDate;
      case 2: return !!travelStyle;
      default: return false;
    }
  };

  const isComplete = () => {
    return !!destination && !!startDate && !!endDate && !!travelStyle;
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1);
  };

  // 더미 광고 컴포넌트 - 실제 이미지 사용
  const DummyAd = ({ width, height, type = 'default' }) => {
    // 랜덤 색상을 미리 정의 (매번 바뀌지 않도록)
    const colors = ['#e9f5ff', '#fff2e8', '#f0f9e8', '#ffeaf5', '#f2f2ff'];
    const bgColor = colors[0]; // 항상 첫 번째 색상 사용
    
    // 고정된 광고 텍스트 (랜덤 사용 안함)
    const adContent = { 
      title: '특가 항공권', 
      desc: '국내 여행 최저가 보장' 
    };

    return (
      <div 
        className="flex flex-col items-center justify-center rounded-md overflow-hidden shadow-sm"
        style={{ width, height }}
      >
        {type === 'image' ? (
          // 이미지 더미 광고
          <div className="relative w-full h-full">
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              backgroundColor: bgColor,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px'
            }}>
              <div className="text-sm font-bold mb-2 text-gray-800">{adContent.title}</div>
              <div className="text-xs text-gray-600">{adContent.desc}</div>
              <div className="mt-3 px-3 py-1 bg-blue-500 text-white text-xs rounded-full">더 알아보기</div>
              <div className="absolute bottom-1 right-1 text-[8px] text-gray-400">광고</div>
            </div>
          </div>
        ) : (
          // 텍스트 더미 광고
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: bgColor,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8px'
          }}>
            <span className="text-xs text-center font-medium text-gray-700 mb-1">광고 영역</span>
            <span className="text-[9px] text-gray-500">{width}x{height}</span>
          </div>
        )}
      </div>
    );
  };

  usePerformance('CreateTravelPlan');

  return (
    <Layout>
      {/* 상단 여백 및 전체 레이아웃 컨테이너 */}
      <div className="mt-20 mb-10">
        {/* 3단 레이아웃: 왼쪽 광고 - 중앙 콘텐츠 - 오른쪽 광고 */}
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-start">
          
          {/* 왼쪽 광고 영역 */}
          <div className="hidden lg:block mr-8 sticky top-24 space-y-4">
            <DummyAd width="160px" height="600px" type="image" />
            <p className="text-xs text-center text-gray-500 mt-1">
              향후 실제 광고로 대체됩니다
            </p>
          </div>
          
          {/* 중앙 콘텐츠 */}
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">국내 여행 계획 만들기</h1>
                
                {/* 단계 표시 */}
                <div className="flex mb-6">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="flex-1">
                      <div className={`h-2 ${i <= step ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                      <p className="text-xs mt-1 text-center">
                        {i === 0 ? '여행지' : i === 1 ? '일정' : '스타일'}
                      </p>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* 스텝 1: 여행지 */}
                  {step === 0 && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-4">어디로 떠나시나요?</h2>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="여행지를 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">인기 국내 여행지:</p>
                        <div className="flex flex-wrap gap-2">
                          {popularDestinations.map((place) => (
                            <button
                              key={place}
                              type="button"
                              onClick={() => setDestination(place)}
                              className={`px-3 py-1 text-sm rounded-full ${
                                destination === place 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {place}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 스텝 2: 여행 기간 */}
                  {step === 1 && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-4">언제 여행하시나요?</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">출발일</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">도착일</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      {startDate && endDate && new Date(startDate) <= new Date(endDate) && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md text-blue-700 text-sm">
                          {calculateDays()}일 여행을 계획 중이시네요!
                        </div>
                      )}
                    </div>
                  )}

                  {/* 스텝 3: 여행 스타일 */}
                  {step === 2 && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-4">어떤 여행을 원하시나요?</h2>
                      <div className="grid grid-cols-1 gap-3">
                        {travelStyles.map((style) => (
                          <div
                            key={style.value}
                            onClick={() => setTravelStyle(style.value)}
                            className={`p-3 border rounded-md cursor-pointer ${
                              travelStyle === style.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium">{style.label}</div>
                            <div className="text-sm text-gray-500">{style.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 네비게이션 버튼 */}
                  <div className="mt-6 flex justify-between">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        이전
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {step < 2 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!canProgress()}
                        className={`px-4 py-2 rounded-md ${
                          canProgress()
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        다음
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!isComplete() || submitting}
                        className={`px-4 py-2 rounded-md ${
                          isComplete() && !submitting
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {submitting ? '처리 중...' : '여행 계획 생성하기'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            {/* 정보 박스 */}
            <div className="mt-4 p-4 bg-gray-50 text-sm text-gray-600 rounded-md">
              <p>AI가 입력하신 정보를 바탕으로 최적의 국내 여행 코스를 추천해 드립니다. 
              더 자세한 정보는 계획 생성 후 수정할 수 있습니다.</p>
            </div>
            
            {/* 모바일 전용 광고 - 데스크톱에서는 숨김 */}
            <div className="mt-6 lg:hidden">
              <DummyAd width="100%" height="100px" type="image" />
              <p className="text-xs text-center text-gray-500 mt-1">
                모바일 광고 영역
              </p>
            </div>
          </div>
          
          {/* 오른쪽 광고 영역 */}
          <div className="hidden lg:block ml-8 sticky top-24 space-y-4">
            <DummyAd width="160px" height="600px" type="image" />
            
            {/* 추가 광고 영역 */}
            <div className="mt-6">
              <DummyAd width="160px" height="300px" type="image" />
            </div>
            
            <p className="text-xs text-center text-gray-500 mt-1">
              향후 실제 광고로 대체됩니다
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 