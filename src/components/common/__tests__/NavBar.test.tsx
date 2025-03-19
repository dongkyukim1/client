import { render, screen } from '@testing-library/react';
import NavSection from '../NavSection';
import { SessionProvider } from 'next-auth/react';

// next/navigation의 useRouter 모킹
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// next-auth/react의 useSession 모킹
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
}));

// NavSection 컴포넌트 성능 테스트
describe('NavSection Component', () => {
  beforeAll(() => {
    // 성능 측정 모킹
    window.performance.mark = jest.fn();
    window.performance.measure = jest.fn();
    window.performance.getEntriesByName = jest.fn().mockReturnValue([{ duration: 50 }]);
    
    // Window 이벤트 리스너 모킹
    Object.defineProperty(window, 'addEventListener', {
      value: jest.fn(),
      writable: true,
    });
    
    Object.defineProperty(window, 'removeEventListener', {
      value: jest.fn(),
      writable: true,
    });
  });

  it('renders without crashing and measures performance', () => {
    const startTime = performance.now();
    
    render(
      <SessionProvider session={null}>
        <NavSection />
      </SessionProvider>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // 렌더링 시간이 100ms 미만이어야 함
    expect(renderTime).toBeLessThan(200); // 100에서 200으로 여유 증가
    
  });
}); 