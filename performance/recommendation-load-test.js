/**
 * 여행 추천 API 부하 테스트 스크립트
 * 
 * 사용법:
 * node recommendation-load-test.js [concurrentRequests] [totalRequests]
 * 
 * 예시:
 * node recommendation-load-test.js 5 100
 * (동시에 5개 요청, 총 100개 요청)
 */

// ESM 스타일 임포트를 사용하기 위해 package.json에 "type": "module"을 추가해야 합니다.
// 하지만 Node.js 스크립트이므로 CommonJS 스타일을 유지합니다.
const axios = require('axios');
const { performance } = require('perf_hooks');

// 기본 설정
const DEFAULT_CONCURRENT_REQUESTS = 5;
const DEFAULT_TOTAL_REQUESTS = 50;
const API_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

// 커맨드 라인 인자 처리
const concurrentRequests = parseInt(process.argv[2], 10) || DEFAULT_CONCURRENT_REQUESTS;
const totalRequests = parseInt(process.argv[3], 10) || DEFAULT_TOTAL_REQUESTS;

// 테스트 설정 출력
console.log('===========================================================');
console.log(`여행 추천 API 부하 테스트 시작`);
console.log(`API URL: ${API_URL}`);
console.log(`동시 요청 수: ${concurrentRequests}`);
console.log(`총 요청 수: ${totalRequests}`);
console.log('===========================================================\n');

// 테스트 결과 저장 변수
const results = {
  successful: 0,
  failed: 0,
  totalTime: 0,
  minTime: Number.MAX_SAFE_INTEGER,
  maxTime: 0,
  responseTimes: []
};

// API 호출 함수
async function makeRequest(index) {
  // 테스트 데이터: 제주도 2일 여행, 자연 및 문화 카테고리
  const testData = {
    area_code: '39', // 제주도
    sigungu_code: '4', // 서귀포시
    category_codes: ['A01', 'A02'], // 자연, 문화시설
    days: 2
  };

  console.log(`요청 #${index} 시작...`);
  const startTime = performance.now();
  
  try {
    // eslint-disable-next-line no-unused-vars
    const { data } = await axios.post(`${API_URL}/api/v1/recommendations/`, testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10초 타임아웃
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`요청 #${index} 완료: ${duration.toFixed(2)}ms`);
    
    // 결과 기록
    results.successful++;
    results.totalTime += duration;
    results.minTime = Math.min(results.minTime, duration);
    results.maxTime = Math.max(results.maxTime, duration);
    results.responseTimes.push(duration);
    
    return { success: true, duration };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.error(`요청 #${index} 실패 (${duration.toFixed(2)}ms): ${error.message}`);
    
    // 실패 기록
    results.failed++;
    
    return { success: false, duration, error: error.message };
  }
}

// 여러 요청을 병렬로 처리하는 함수
async function runBatch(startIndex, count) {
  const promises = [];
  
  for (let i = 0; i < count; i++) {
    const requestIndex = startIndex + i;
    promises.push(makeRequest(requestIndex));
  }
  
  return Promise.all(promises);
}

// 메인 테스트 실행 함수
async function runLoadTest() {
  console.log('부하 테스트 시작...\n');
  const globalStartTime = performance.now();
  
  let processed = 0;
  while (processed < totalRequests) {
    const remaining = totalRequests - processed;
    const batchSize = Math.min(remaining, concurrentRequests);
    
    await runBatch(processed + 1, batchSize);
    processed += batchSize;
    
    // 진행 상황 출력
    const percentComplete = ((processed / totalRequests) * 100).toFixed(1);
    console.log(`\n진행률: ${percentComplete}% (${processed}/${totalRequests})\n`);
  }
  
  const globalEndTime = performance.now();
  const totalTestTime = globalEndTime - globalStartTime;
  
  // 결과 요약 표시
  console.log('\n===========================================================');
  console.log('테스트 완료! 결과 요약:');
  console.log('===========================================================');
  console.log(`총 요청: ${totalRequests}`);
  console.log(`성공: ${results.successful}`);
  console.log(`실패: ${results.failed}`);
  console.log(`성공률: ${((results.successful / totalRequests) * 100).toFixed(1)}%`);
  console.log(`총 테스트 시간: ${totalTestTime.toFixed(2)}ms (${(totalTestTime / 1000).toFixed(2)}초)`);
  
  if (results.successful > 0) {
    console.log(`평균 응답 시간: ${(results.totalTime / results.successful).toFixed(2)}ms`);
    console.log(`최소 응답 시간: ${results.minTime.toFixed(2)}ms`);
    console.log(`최대 응답 시간: ${results.maxTime.toFixed(2)}ms`);
    
    // 백분위수 계산
    results.responseTimes.sort((a, b) => a - b);
    const p50 = results.responseTimes[Math.floor(results.responseTimes.length * 0.5)];
    const p90 = results.responseTimes[Math.floor(results.responseTimes.length * 0.9)];
    const p95 = results.responseTimes[Math.floor(results.responseTimes.length * 0.95)];
    const p99 = results.responseTimes[Math.floor(results.responseTimes.length * 0.99)];
    
    console.log(`중간값(P50): ${p50.toFixed(2)}ms`);
    console.log(`90 백분위수(P90): ${p90.toFixed(2)}ms`);
    console.log(`95 백분위수(P95): ${p95.toFixed(2)}ms`);
    console.log(`99 백분위수(P99): ${p99.toFixed(2)}ms`);
  }
  
  console.log('===========================================================');
}

// 테스트 실행
runLoadTest().catch(error => {
  console.error('테스트 실행 중 오류 발생:', error);
  process.exit(1);
}); 