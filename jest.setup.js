// 확장 Jest 매처로 @testing-library/jest-dom 추가
import '@testing-library/jest-dom';

// Next.js의 useSearchParams 모킹
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useSearchParams: () => {
    return {
      get: jest.fn().mockImplementation(key => {
        if (key === 'error') return null;
        if (key === 'callbackUrl') return '/';
        return null;
      }),
      has: jest.fn().mockReturnValue(false)
    };
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// 브라우저 환경 모킹
if (typeof window !== 'undefined') {
  // IntersectionObserver 모킹
  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  }
  
  window.IntersectionObserver = MockIntersectionObserver;
  
  // 성능 측정 API 모킹
  if (!window.performance) {
    window.performance = {};
  }
  
  window.performance.mark = window.performance.mark || jest.fn();
  window.performance.measure = window.performance.measure || jest.fn();
  window.performance.getEntriesByType = window.performance.getEntriesByType || jest.fn(() => []);
  window.performance.getEntriesByName = window.performance.getEntriesByName || jest.fn(() => [{
    duration: 10,
  }]);
  
  // matchMedia 모킹
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
}

// 모든 테스트에 대한 전역 타임아웃 설정
jest.setTimeout(10000); 