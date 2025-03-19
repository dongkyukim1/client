import { authApi } from '@/services/api';

// 이 테스트는 실제 API와 통신합니다
// process.env.RUN_INTEGRATION_TESTS 환경 변수가 설정된 경우에만 실행
const itif = process.env.RUN_INTEGRATION_TESTS ? it : it.skip;

describe('Auth API Integration Performance Tests', () => {
  // 테스트 계정 정보 (테스트 전용 계정 사용 권장)
  const testUser = {
    username: process.env.TEST_USERNAME || 'performancetest',
    password: process.env.TEST_PASSWORD || 'testpassword123',
    email: process.env.TEST_EMAIL || 'performance@test.com',
    name: '성능 테스트 사용자'
  };

  // 로그인 API 통합 성능 테스트
  itif('measures actual login API performance', async () => {
    // 시작 시간 측정
    const startTime = performance.now();

    try {
      // 실제 로그인 API 호출
      const response = await authApi.login({
        username: testUser.username,
        password: testUser.password
      });

      // 종료 시간 측정
      const endTime = performance.now();
      const duration = endTime - startTime;

      // 응답 검증
      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.accessToken).toBeDefined();

      console.log(`Actual Login API Response Time: ${duration.toFixed(2)}ms`);
      
      // 성능 기준 설정 (실제 API는 더 긴 시간이 필요할 수 있음)
      expect(duration).toBeLessThan(1000); // 1초 이내
    } catch (error) {
      console.error('Login API test failed:', error);
      throw error;
    }
  });

  // 회원가입 API 통합 성능 테스트
  // 참고: 이 테스트는 매번 새로운 사용자를 생성해야 함
  itif('measures actual signup API performance', async () => {
    // 고유한 사용자명 생성 (타임스탬프 사용)
    const uniqueUsername = `${testUser.username}_${Date.now()}`;
    const uniqueEmail = `test_${Date.now()}@example.com`;

    // 시작 시간 측정
    const startTime = performance.now();

    try {
      // 실제 회원가입 API 호출
      const response = await authApi.register({
        username: uniqueUsername,
        email: uniqueEmail,
        password: testUser.password,
        name: testUser.name
      });

      // 종료 시간 측정
      const endTime = performance.now();
      const duration = endTime - startTime;

      // 응답 검증
      expect(response).toBeDefined();
      expect(response.user).toBeDefined();

      console.log(`Actual Signup API Response Time: ${duration.toFixed(2)}ms`);
      
      // 성능 기준 설정
      expect(duration).toBeLessThan(1500); // 1.5초 이내
    } catch (error) {
      console.error('Signup API test failed:', error);
      throw error;
    }
  });
}); 