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
  
  // 모킹된 성능 항목 생성 도우미 함수
  const createMockEntry = (name, startTime, duration) => ({
    name,
    entryType: 'measure',
    startTime: startTime || 0,
    duration: duration || 10,
    toJSON: () => ({ name, entryType: 'measure', startTime, duration }),
  });
  
  // 성능 측정 항목 저장
  const performanceEntries = new Map();
  
  window.performance.mark = window.performance.mark || jest.fn((name) => {
    performanceEntries.set(name, {
      name,
      entryType: 'mark',
      startTime: Date.now(),
      duration: 0,
    });
  });
  
  window.performance.measure = window.performance.measure || jest.fn((name, startMark, endMark) => {
    const start = performanceEntries.get(startMark);
    const end = performanceEntries.get(endMark);
    
    if (!start) {
      throw new Error(`The mark '${startMark}' does not exist.`);
    }
    
    if (!end) {
      throw new Error(`The mark '${endMark}' does not exist.`);
    }
    
    const duration = end.startTime - start.startTime;
    performanceEntries.set(name, createMockEntry(name, start.startTime, duration));
  });
  
  window.performance.getEntriesByType = window.performance.getEntriesByType || jest.fn((type) => {
    const entries = [];
    performanceEntries.forEach(entry => {
      if (entry.entryType === type) {
        entries.push(entry);
      }
    });
    return entries;
  });
  
  window.performance.getEntriesByName = window.performance.getEntriesByName || jest.fn((name, type) => {
    const entry = performanceEntries.get(name);
    if (entry && (!type || entry.entryType === type)) {
      return [entry];
    }
    return [];
  });
  
  window.performance.clearMarks = window.performance.clearMarks || jest.fn(() => {
    performanceEntries.forEach((entry, key) => {
      if (entry.entryType === 'mark') {
        performanceEntries.delete(key);
      }
    });
  });
  
  window.performance.clearMeasures = window.performance.clearMeasures || jest.fn(() => {
    performanceEntries.forEach((entry, key) => {
      if (entry.entryType === 'measure') {
        performanceEntries.delete(key);
      }
    });
  });
  
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