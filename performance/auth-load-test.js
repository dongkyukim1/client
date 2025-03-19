import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// 성능 측정을 위한 사용자 정의 메트릭
const loginDuration = new Counter('login_duration');
const signupDuration = new Counter('signup_duration');

// 테스트 설정
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // 10명의 사용자로 램프 업
    { duration: '1m', target: 50 },  // 50명의 사용자로 램프 업
    { duration: '30s', target: 100 }, // 100명의 사용자로 램프 업
    { duration: '2m', target: 100 },  // 100명의 사용자로 2분 동안 부하 테스트
    { duration: '30s', target: 0 },   // 사용자 수 줄이기
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95%의 요청이 1초 이내에 완료되어야 함
    'login_duration': ['p(95)<1500'],   // 95%의 로그인이 1.5초 이내에 완료되어야 함
    'signup_duration': ['p(95)<2000'],  // 95%의 회원가입이 2초 이내에 완료되어야 함
  },
};

export default function() {
  const baseUrl = 'http://localhost:8080'; // API 서버 URL

  // 회원가입 API 성능 테스트
  const signupStart = new Date().getTime();
  
  const uniqueUsername = `loadtest_${new Date().getTime()}`;
  const uniqueEmail = `loadtest_${new Date().getTime()}@example.com`;
  
  const signupRes = http.post(`${baseUrl}/api/auth/register`, JSON.stringify({
    username: uniqueUsername,
    email: uniqueEmail,
    password: 'LoadTest123!',
    name: 'Load Test User'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const signupEnd = new Date().getTime();
  const signupTime = signupEnd - signupStart;
  
  signupDuration.add(signupTime);
  
  check(signupRes, {
    'Signup status is 201': (r) => r.status === 201,
  });
  
  sleep(1);
  
  // 로그인 API 성능 테스트
  const loginStart = new Date().getTime();
  
  const loginRes = http.post(`${baseUrl}/api/auth/login`, JSON.stringify({
    username: uniqueUsername,
    password: 'LoadTest123!'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const loginEnd = new Date().getTime();
  const loginTime = loginEnd - loginStart;
  
  loginDuration.add(loginTime);
  
  check(loginRes, {
    'Login status is 200': (r) => r.status === 200,
    'Has access token': (r) => JSON.parse(r.body).accessToken !== undefined,
  });
  
  sleep(3);
} 