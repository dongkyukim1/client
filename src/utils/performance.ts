/**
 * 성능 측정 유틸리티
 */
import React from 'react';

// 성능 측정 시작
export const startMeasure = (markName: string): void => {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(`start_${markName}`);
  }
};

// 성능 측정 종료 및 결과 반환
export const endMeasure = (markName: string): number | null => {
  if (typeof window !== 'undefined' && window.performance) {
    const startMark = `start_${markName}`;
    const endMark = `end_${markName}`;
    
    window.performance.mark(endMark);
    window.performance.measure(markName, startMark, endMark);
    
    const entries = window.performance.getEntriesByName(markName, 'measure');
    if (entries.length > 0) {
      const duration = entries[0].duration;
      console.log(`${markName}: ${duration.toFixed(2)}ms`);
      return duration;
    }
  }
  return null;
};

// 컴포넌트 렌더링 성능 측정 HOC - JSX 대신 createElement 사용
export const withPerformanceTracking = (Component, componentName) => {
  return (props) => {
    React.useEffect(() => {
      startMeasure(`render_${componentName}`);
      
      return () => {
        endMeasure(`render_${componentName}`);
      };
    }, []);
    
    return React.createElement(Component, props); // JSX 대신 이 방식 사용
  };
}; 