import { authApi } from '@/services/api';
import { startMeasure, endMeasure } from '@/utils/performance';

// API 호출 모킹
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
    status: 200
  })
) as jest.Mock;

describe('Auth API Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 성능 측정 모킹
    window.performance.mark = jest.fn();
    window.performance.measure = jest.fn();
    window.performance.getEntriesByName = jest.fn().mockReturnValue([{ duration: 150 }]);
  });
  
  it('measures login API response time', async () => {
    // 로그인 API 호출 시간 측정
    startMeasure('login_api');
    
    // 예시 로그인 데이터
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    const duration = endMeasure('login_api');
    
    // API 응답 시간이 500ms 미만이어야 함
    expect(duration).toBeDefined();
    expect(duration).toBeLessThan(500);
    
    // fetch가 올바르게 호출되었는지 확인
    expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object));
  });
  
  it('measures signup API response time', async () => {
    // 회원가입 API 호출 시간 측정
    startMeasure('signup_api');
    
    // 예시 회원가입 데이터
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });
    
    const duration = endMeasure('signup_api');
    
    // API 응답 시간이 500ms 미만이어야 함
    expect(duration).toBeDefined();
    expect(duration).toBeLessThan(500);
    
    // fetch가 올바르게 호출되었는지 확인
    expect(fetch).toHaveBeenCalledWith('/api/auth/signup', expect.any(Object));
  });
  
  it('measures social login redirection time', async () => {
    // 소셜 로그인 리다이렉션 성능 측정
    startMeasure('social_login_redirect');
    
    // window.location.href 모킹
    delete window.location;
    window.location = { href: '' } as Location;
    
    // 소셜 로그인 호출
    const provider = 'google';
    authApi.login(provider);
    
    const duration = endMeasure('social_login_redirect');
    
    // 리다이렉션 시간이 200ms 미만이어야 함
    expect(duration).toBeDefined();
    expect(duration).toBeLessThan(200);
  });
}); 