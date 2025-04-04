import { useEffect } from 'react';
import { startMeasure, endMeasure } from '@/utils/performance';

/**
 * 컴포넌트 성능을 측정하는 훅
 * @param componentName 성능을 측정할 컴포넌트 이름
 * @returns undefined
 */
export default function usePerformance(componentName: string): void {
  useEffect(() => {
    // 컴포넌트 마운트 시 성능 측정 시작
    const markName = `render_${componentName}`;
    startMeasure(markName);
    
    // 흔한 웹 성능 지표들을 측정 (개발 모드에서만)
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      // 첫 번째 컨텐츠풀 페인트(FCP) 측정
      const reportFCP = () => {
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          console.log(`[${componentName}] FCP: ${fcpEntry.startTime.toFixed(2)}ms`);
        }
      };
      
      // 페이지 로드 시 FCP 측정
      if (document.readyState === 'complete') {
        reportFCP();
      } else {
        window.addEventListener('load', reportFCP, { once: true });
      }
    }
    
    // 컴포넌트 언마운트 시 성능 측정 종료
    return () => {
      const duration = endMeasure(markName);
      
      // 이 로그는 개발 모드에서만 출력됨 (utils/performance.ts의 endMeasure 함수에서 처리)
      if (duration === null && process.env.NODE_ENV !== 'production') {
        console.warn(`[${componentName}] 성능 측정 실패: 시작 마크 부재 또는 오류`);
      }
    };
  }, [componentName]);
} 