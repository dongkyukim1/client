import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { recommendationApi } from '@/services/api';
import { startMeasure, endMeasure } from '@/utils/performance';

// axios 요청을 모킹하기 위한 어댑터
const mockAxios = new MockAdapter(axios, { onNoMatch: 'passthrough' });

// API 모킹 - axios 인스턴스 등을 고려하여 모든 요청 모킹
beforeAll(() => {
  // 모든 axios POST 요청을 가로채기
  mockAxios.onAny(/\/api\/v1\/recommendations/).reply(200, mockRecommendationResponse);
  mockAxios.onAny(/\/api\/recommend\/save/).reply(200, mockSaveResponse);
});

afterAll(() => {
  mockAxios.restore();
});

// 모의 데이터
const mockRecommendationResponse = {
  schedule: {
    day_1: {
      spots: [
        {
          name: "제주 올레길 7코스",
          addr1: "제주특별자치도 서귀포시 색달동",
          category_name: "자연",
          category_code: "A01",
          type: "tourist_spot",
          latitude: 33.258823,
          longitude: 126.409732
        },
        {
          name: "천지연폭포",
          addr1: "제주특별자치도 서귀포시 서귀동 2565",
          category_name: "자연",
          category_code: "A01",
          type: "tourist_spot",
          latitude: 33.246944,
          longitude: 126.554386
        }
      ],
      accommodation: {
        name: "서귀포 호텔",
        addr1: "제주특별자치도 서귀포시 색달동 2812-4"
      }
    },
    day_2: {
      spots: [
        {
          name: "성산일출봉",
          addr1: "제주특별자치도 서귀포시 성산읍 성산리 1",
          category_name: "자연",
          category_code: "A01",
          type: "tourist_spot",
          latitude: 33.458278,
          longitude: 126.942842
        },
        {
          name: "우도",
          addr1: "제주특별자치도 제주시 우도면",
          category_name: "자연",
          category_code: "A01",
          type: "tourist_spot",
          latitude: 33.503194,
          longitude: 126.952153
        }
      ],
      accommodation: {
        name: "제주시 호텔",
        addr1: "제주특별자치도 제주시 노형동 929-3"
      }
    }
  },
  message: "제주도 여행 계획이 생성되었습니다."
};

// 모의 API 저장 응답
const mockSaveResponse = {
  id: "12345",
  message: "여행 계획이 성공적으로 저장되었습니다."
};

describe('여행 추천 API 성능 테스트', () => {
  // 각 테스트 후 타이머 초기화
  afterEach(() => {
    mockAxios.reset();
  });

  it('여행 추천 API 호출 성능 측정', async () => {
    // 성능 측정 시작
    startMeasure('travel_recommendation_api');
    
    // API 호출
    try {
      const { data } = await recommendationApi.getTravelRecommendations(
        '39', // 제주도
        '4',  // 서귀포시
        ['A01', 'A02'], // 자연, 문화시설
        2    // 2일 여행
      );
      
      // 성능 측정 종료
      const duration = endMeasure('travel_recommendation_api');
      console.log(`여행 추천 API 호출 소요 시간: ${duration?.toFixed(2) || 'N/A'}ms`);
      
      // API 응답이 예상대로 있는지 확인
      expect(data).toBeDefined();
      expect(data.schedule).toBeDefined();
      
      // API 응답 시간이 500ms 미만이어야 함
      if (duration !== null) {
        expect(duration).toBeLessThan(500);
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
      // 테스트 실패
      throw error;
    }
  });

  it('여행 추천 저장 API 호출 성능 측정', async () => {
    // 테스트 데이터 준비
    const planData = {
      destination: '제주도',
      startDate: '2023-04-01',
      endDate: '2023-04-03',
      travelStyle: 'nature',
      duration: 2,
      schedule: mockRecommendationResponse.schedule,
      message: mockRecommendationResponse.message
    };

    // FormData 모킹
    const originalFormData = global.FormData;
    const mockFormDataAppend = jest.fn();
    global.FormData = jest.fn().mockImplementation(() => ({
      append: mockFormDataAppend
    }));

    // 성능 측정 시작
    startMeasure('travel_recommendation_save_api');
    
    // API 호출
    try {
      const response = await recommendationApi.saveTravelRecommendation(planData);
      
      // 성능 측정 종료
      const duration = endMeasure('travel_recommendation_save_api');
      console.log(`여행 추천 저장 API 호출 소요 시간: ${duration?.toFixed(2) || 'N/A'}ms`);
      
      // API 응답이 예상대로 있는지 확인
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe("12345");
      
      // FormData가 올바르게 구성되었는지 확인
      expect(mockFormDataAppend).toHaveBeenCalledWith('data', expect.any(String));
      
      // API 응답 시간이 300ms 미만이어야 함
      if (duration !== null) {
        expect(duration).toBeLessThan(300);
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
      // 테스트 실패
      throw error;
    } finally {
      // FormData 원상복구
      global.FormData = originalFormData;
    }
  });

  it('여행 추천 API 부하 테스트 (10회 연속 호출)', async () => {
    // 성능 측정 시작
    startMeasure('travel_recommendation_load_test');
    
    // 10회 연속 API 호출
    const callCount = 10;
    const results = [];
    const promises = [];

    for (let i = 0; i < callCount; i++) {
      const promise = recommendationApi.getTravelRecommendations(
        '39', // 제주도
        '4',  // 서귀포시
        ['A01', 'A02'], // 자연, 문화시설
        2    // 2일 여행
      ).then(response => {
        results.push(response.data);
        return response;
      });
      
      promises.push(promise);
    }
    
    // 모든 API 호출 완료 대기
    try {
      await Promise.all(promises);
      
      // 성능 측정 종료
      const duration = endMeasure('travel_recommendation_load_test');
      console.log(`여행 추천 API 10회 호출 총 소요 시간: ${duration}ms`);
      console.log(`여행 추천 API 호출당 평균 소요 시간: ${duration ? duration / callCount : 'N/A'}ms`);
      
      // 모든 호출이 성공했는지 확인
      expect(results.length).toBe(callCount);
      
      // 총 응답 시간이 2초 미만이어야 함 (200ms * 10 = 2000ms)
      if (duration) {
        expect(duration).toBeLessThan(2000);
      }
    } catch (error) {
      console.error('API 호출 실패:', error);
      // 테스트 실패
      throw error;
    }
  });
}); 