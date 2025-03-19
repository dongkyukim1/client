import { useEffect, useRef } from 'react';

/**
 * 컴포넌트 성능을 측정하는 커스텀 훅
 * @param componentName 측정할 컴포넌트 이름
 * @param deps 의존성 배열 (재렌더링 트리거)
 */
export const usePerformance = (componentName: string, deps: any[] = []) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    const startTime = performance.now();
    renderCount.current += 1;
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.log(`[Performance] ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    };
  }, deps);
};

export default usePerformance; 