import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { authApi } from '@/services/api';
import { startMeasure, endMeasure } from '@/utils/performance';

// axios 요청을 모킹하기 위한 어댑터
const mockAxios = new MockAdapter(axios);

describe('Auth API Performance Tests', () => {
  // 각 테스트 후 타이머 초기화
  afterEach(() => {
    mockAxios.reset();
  });

  it('measures login API call performance', async () => {
    // 로그인 API 응답 모킹
    mockAxios.onPost('/api/auth/login').reply(200, {
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'fake-jwt-token',
    });

    // 성능 측정 시작
    startMeasure('login_api_call');
    
    // API 호출
    try {
      // authApi.login 메서드가 내부적으로 axios를 사용하고 있다고 가정
      // 실제 구현에 따라 수정 필요
      await authApi.loginWithCredentials('test@example.com', 'password');
      
      // 성능 측정 종료
      const duration = endMeasure('login_api_call');
      console.log(`Login API call duration: ${duration}ms`);
      
      // API 응답 시간이 200ms 미만이어야 함
      expect(duration).toBeLessThan(200);
    } catch (error) {
      console.error('API call failed:', error);
      // 테스트 실패
      throw error;
    }
  });

  it('measures registration API call performance', async () => {
    // 회원가입 API 응답 모킹
    mockAxios.onPost('/api/auth/register').reply(200, {
      user: { id: '2', name: 'New User', email: 'new@example.com' },
      token: 'fake-jwt-token',
    });

    // 성능 측정 시작
    startMeasure('register_api_call');
    
    // API 호출
    try {
      // authApi.register 메서드가 내부적으로 axios를 사용하고 있다고 가정
      // 실제 구현에 따라 수정 필요
      await authApi.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });
      
      // 성능 측정 종료
      const duration = endMeasure('register_api_call');
      console.log(`Registration API call duration: ${duration}ms`);
      
      // API 응답 시간이 200ms 미만이어야 함
      expect(duration).toBeLessThan(200);
    } catch (error) {
      console.error('API call failed:', error);
      // 테스트 실패
      throw error;
    }
  });
}); 