"use client";

import React from 'react';
import { FaCar, FaBus, FaWalking, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { AllRouteInfo } from '@/utils/kakaoMapUtils';

// 컴포넌트 props 타입 정의
interface RouteInfoProps {
  routeInfo: AllRouteInfo | null;
  isLoading: boolean;
  originName: string;
  destinationName: string;
  colorMode: 'light' | 'dark' | 'neutral';
}

const RouteInfo: React.FC<RouteInfoProps> = ({
  routeInfo,
  isLoading,
  originName,
  destinationName,
  colorMode
}) => {
  // 색상 테마에 따른 스타일 정의
  const getBgColor = () => {
    switch (colorMode) {
      case 'dark': return 'bg-gray-800';
      case 'neutral': return 'bg-[#e8eef5]';
      default: return 'bg-white';
    }
  };

  const getTextColor = () => {
    switch (colorMode) {
      case 'dark': return 'text-white';
      case 'neutral': return 'text-[#334155]';
      default: return 'text-gray-800';
    }
  };

  const getSubTextColor = () => {
    switch (colorMode) {
      case 'dark': return 'text-gray-300';
      case 'neutral': return 'text-[#64748b]';
      default: return 'text-gray-500';
    }
  };

  const getBorderColor = () => {
    switch (colorMode) {
      case 'dark': return 'border-gray-700';
      case 'neutral': return 'border-[#cbd5e1]';
      default: return 'border-gray-200';
    }
  };

  // 아이콘 배경 색상
  const getIconBgColor = (type: 'driving' | 'transit' | 'walking') => {
    if (colorMode === 'dark') {
      return 'bg-gray-700';
    }

    switch (type) {
      case 'driving': return 'bg-blue-100';
      case 'transit': return 'bg-green-100';
      case 'walking': return 'bg-amber-100';
      default: return 'bg-gray-100';
    }
  };

  // 아이콘 색상
  const getIconColor = (type: 'driving' | 'transit' | 'walking') => {
    switch (type) {
      case 'driving': return 'text-blue-500';
      case 'transit': return 'text-green-500';
      case 'walking': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className={`${getBgColor()} ${getTextColor()} rounded-xl p-4 ${getBorderColor()} border shadow-sm`}>
        <div className="flex justify-center items-center py-4">
          <FaSpinner className="animate-spin text-2xl mr-2" />
          <span>경로 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 경로 정보가 없거나 오류가 있을 때 표시할 컴포넌트
  if (!routeInfo || routeInfo.error) {
    return (
      <div className={`${getBgColor()} ${getTextColor()} rounded-xl p-4 ${getBorderColor()} border shadow-sm`}>
        <div className="text-center py-2">
          <p>경로 정보를 불러올 수 없습니다.</p>
          {routeInfo?.error && <p className="text-sm mt-1 text-red-500">{routeInfo.error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`${getBgColor()} ${getTextColor()} rounded-xl p-4 ${getBorderColor()} border shadow-sm`}>
      {/* 헤더 - 출발지, 도착지 정보 */}
      <div className="mb-3 pb-3 border-b border-dashed border-gray-300">
        <div className="flex items-center mb-1">
          <FaMapMarkerAlt className="text-blue-500 mr-2" />
          <span className={`${getSubTextColor()} text-sm`}>출발지:</span>
          <span className="ml-2 font-medium">{originName}</span>
        </div>
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-red-500 mr-2" />
          <span className={`${getSubTextColor()} text-sm`}>도착지:</span>
          <span className="ml-2 font-medium">{destinationName}</span>
        </div>
      </div>

      {/* 경로 정보 */}
      <div className="grid gap-3">
        {/* 자동차 */}
        {routeInfo.driving && (
          <div className="flex items-center">
            <div className={`${getIconBgColor('driving')} p-3 rounded-full mr-3`}>
              <FaCar className={`${getIconColor('driving')} text-lg`} />
            </div>
            <div>
              <div className="font-medium">자동차</div>
              <div className={`${getSubTextColor()} text-sm`}>
                {routeInfo.driving.formattedDistance} · {routeInfo.driving.formattedDuration}
              </div>
            </div>
          </div>
        )}

        {/* 대중교통 */}
        {routeInfo.transit && (
          <div className="flex items-center">
            <div className={`${getIconBgColor('transit')} p-3 rounded-full mr-3`}>
              <FaBus className={`${getIconColor('transit')} text-lg`} />
            </div>
            <div>
              <div className="font-medium">대중교통</div>
              <div className={`${getSubTextColor()} text-sm`}>
                {routeInfo.transit.formattedDistance} · {routeInfo.transit.formattedDuration}
              </div>
            </div>
          </div>
        )}

        {/* 도보 */}
        {routeInfo.walking && (
          <div className="flex items-center">
            <div className={`${getIconBgColor('walking')} p-3 rounded-full mr-3`}>
              <FaWalking className={`${getIconColor('walking')} text-lg`} />
            </div>
            <div>
              <div className="font-medium">도보</div>
              <div className={`${getSubTextColor()} text-sm`}>
                {routeInfo.walking.formattedDistance} · {routeInfo.walking.formattedDuration}
              </div>
            </div>
          </div>
        )}

        {/* 아무 경로도 없을 경우 */}
        {!routeInfo.driving && !routeInfo.transit && !routeInfo.walking && (
          <div className="text-center py-2">
            <p>이용 가능한 경로 정보가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteInfo; 