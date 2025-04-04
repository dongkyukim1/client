import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTravelPlan from '@/app/travel/create/page';
import { startMeasure, endMeasure } from '@/utils/performance';
import { recommendationApi } from '@/services/api';

// Jest-dom 타입 확장
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// recommendationApi 모킹
jest.mock('@/services/api', () => ({
  recommendationApi: {
    getTravelRecommendations: jest.fn(),
    saveTravelRecommendation: jest.fn()
  }
}));

// 모의 응답 데이터
const mockRecommendationData = {
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
        }
      ],
      accommodation: {
        name: "서귀포 호텔",
        addr1: "제주특별자치도 서귀포시 색달동 2812-4"
      }
    }
  },
  message: "제주도 여행 계획이 생성되었습니다."
};

describe('CreateTravelPlan 컴포넌트 성능 테스트', () => {
  beforeEach(() => {
    // DOM 요소의 textContent를 모킹
    Object.defineProperty(HTMLElement.prototype, 'textContent', {
      get() {
        return '';
      }
    });
    
    // API 모의 응답 설정
    (recommendationApi.getTravelRecommendations as jest.Mock).mockResolvedValue({
      data: mockRecommendationData
    });
    (recommendationApi.saveTravelRecommendation as jest.Mock).mockResolvedValue({
      data: { id: '12345', message: 'Success' }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컴포넌트 초기 렌더링 성능 측정', async () => {
    // 렌더링 성능 측정 시작
    startMeasure('create_travel_plan_initial_render');
    
    // 컴포넌트 렌더링
    render(<CreateTravelPlan />);
    
    // 성능 측정 종료
    const duration = endMeasure('create_travel_plan_initial_render');
    console.log(`초기 렌더링 소요 시간: ${duration || 'N/A'}ms`);
    
    // 컴포넌트가 올바르게 렌더링되었는지 확인
    expect(screen.getByText('국내 여행 계획 만들기')).toBeInTheDocument();
    
    // 렌더링 시간이 200ms 미만이어야 함
    if (duration) {
      expect(duration).toBeLessThan(200);
    }
  });

  it('폼 입력 및 제출 성능 측정', async () => {
    render(<CreateTravelPlan />);
    
    // 1단계: 여행지 선택
    const destinationInput = screen.getByPlaceholderText('여행지를 입력하세요');
    
    startMeasure('travel_destination_input');
    fireEvent.change(destinationInput, { target: { value: '제주도' } });
    const inputDuration = endMeasure('travel_destination_input');
    console.log(`여행지 입력 반응 시간: ${inputDuration || 'N/A'}ms`);
    
    const nextButton = screen.getByText('다음');
    
    startMeasure('step_navigation');
    fireEvent.click(nextButton);
    const navigationDuration = endMeasure('step_navigation');
    console.log(`단계 전환 소요 시간: ${navigationDuration || 'N/A'}ms`);
    
    // 2단계: 날짜 선택
    await waitFor(() => {
      expect(screen.getByText('언제 여행하시나요?')).toBeInTheDocument();
    });
    
    // 날짜 입력 필드
    const startDateInput = screen.getAllByRole('textbox')[0];
    const endDateInput = screen.getAllByRole('textbox')[1];

    startMeasure('travel_dates_input');
    fireEvent.change(startDateInput, { target: { value: '2023-10-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-10-03' } });
    const datesDuration = endMeasure('travel_dates_input');
    console.log(`날짜 입력 반응 시간: ${datesDuration || 'N/A'}ms`);
    
    // 다음 단계로
    const nextButton2 = screen.getByText('다음');
    fireEvent.click(nextButton2);
    
    // 3단계: 여행 스타일 선택
    await waitFor(() => {
      expect(screen.getByText('어떤 여행을 원하시나요?')).toBeInTheDocument();
    });
    
    const natureStyle = screen.getByText('자연/풍경');
    
    startMeasure('travel_style_selection');
    fireEvent.click(natureStyle);
    const styleDuration = endMeasure('travel_style_selection');
    console.log(`여행 스타일 선택 반응 시간: ${styleDuration || 'N/A'}ms`);
    
    // 폼 제출
    const submitButton = screen.getByText('여행 계획 생성하기');
    
    startMeasure('form_submit');
    fireEvent.click(submitButton);
    
    // API 호출 및 결과 렌더링 대기
    await waitFor(() => {
      expect(recommendationApi.getTravelRecommendations).toHaveBeenCalled();
    });
    
    const submitDuration = endMeasure('form_submit');
    console.log(`폼 제출 처리 시간: ${submitDuration || 'N/A'}ms`);
    
    // 응답 시간은 API 호출 포함하므로 500ms 미만
    if (submitDuration) {
      expect(submitDuration).toBeLessThan(500);
    }
  });

  it('API 결과 렌더링 성능 측정', async () => {
    // 컴포넌트 렌더링
    render(<CreateTravelPlan />);
    
    // 폼 완성 및 제출
    // 여행지 선택
    fireEvent.change(screen.getByPlaceholderText('여행지를 입력하세요'), { 
      target: { value: '제주도' } 
    });
    fireEvent.click(screen.getByText('다음'));
    
    // 날짜 선택
    await waitFor(() => {
      expect(screen.getByText('언제 여행하시나요?')).toBeInTheDocument();
    });
    
    const startDateInput = screen.getAllByRole('textbox')[0];
    const endDateInput = screen.getAllByRole('textbox')[1];
    
    fireEvent.change(startDateInput, { target: { value: '2023-10-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-10-03' } });
    fireEvent.click(screen.getByText('다음'));
    
    // 여행 스타일 선택
    await waitFor(() => {
      expect(screen.getByText('어떤 여행을 원하시나요?')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('자연/풍경'));
    
    // 제출하기 전에 성능 측정 준비
    startMeasure('recommendation_result_render');
    
    // 폼 제출
    fireEvent.click(screen.getByText('여행 계획 생성하기'));
    
    // 결과가 렌더링될 때까지 대기
    await waitFor(() => {
      expect(screen.getByText('여행 계획이 준비되었습니다!')).toBeInTheDocument();
    });
    
    // 성능 측정 종료
    const duration = endMeasure('recommendation_result_render');
    console.log(`추천 결과 렌더링 소요 시간: ${duration || 'N/A'}ms`);
    
    // 렌더링 시간 검증
    if (duration) {
      expect(duration).toBeLessThan(1000); // API 호출 포함해서 1초 미만
    }
    
    // 결과가 올바르게 표시되는지 확인
    expect(screen.getByText('제주 올레길 7코스')).toBeInTheDocument();
    expect(screen.getByText('서귀포 호텔')).toBeInTheDocument();
  });
}); 