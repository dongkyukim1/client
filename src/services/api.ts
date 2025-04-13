import axios from 'axios';
// import { Resume, CreateResumeRequest, UpdateResumeRequest } from '@/types';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// FastAPI 클라이언트
const fastapiClient = axios.create({
  baseURL: FASTAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('FastAPI URL:', FASTAPI_URL);

// Request interceptor for adding auth token
api.interceptors.request.use(async (config) => {
  // NextAuth 세션에서 토큰 가져오기
  const session = await getSession();
  const token = session?.user?.accessToken as string;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 이력서 API 삭제

// TravelRecommendation 타입 정의
interface TravelPlanData {
  destination: string;
  startDate: string;
  endDate: string;
  travelStyle: string;
  duration: number;
  schedule: Record<string, {
    spots: Array<{
      name: string;
      addr1: string;
      addr2?: string;
      category_name?: string;
      category_code?: string;
      type?: string;
      latitude?: number;
      longitude?: number;
    }>;
    accommodation?: {
      name: string;
      addr1: string;
      addr2?: string;
    };
  }>;
  message?: string;
}

// 여행 추천 API
export const recommendationApi = {
  getTravelRecommendations: (areaCode: string, sigunguCode: string, categories: string[], days: number) => {
    console.log('Sending recommendation request:', {
      area_code: areaCode,
      sigungu_code: sigunguCode,
      category_codes: categories,
      days: days
    });
    return fastapiClient.post('/api/v1/recommendations/', {
      area_code: areaCode,
      sigungu_code: sigunguCode,
      category_codes: categories,
      days: days
    });
  },

  // 추천 결과 저장 API
  saveTravelRecommendation: (data: TravelPlanData, proofImage?: File) => {
    console.log('Saving travel recommendation:', data);

    const formData = new FormData();

    // JSON 데이터를 FormData에 추가
    formData.append('data', JSON.stringify(data));

    // 증명 이미지가 있으면 추가
    if (proofImage) {
      formData.append('proofImage', proofImage);
    }

    return api.post('/api/recommend/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const authApi = {
  /** 일반 로그인 */
  login: async (credentials: Record<string, string> | undefined) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: credentials?.email,
        password: credentials?.password,
      })
      return res.data
    } catch (error) {
      console.log("일반 로그인 API 호출 중 에러: ", error)
    }
  },

  /** 회원가입 */
  signUp: async (nickname: string, email: string, password: string, phoneNumber: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/sign-up`, {
        nickname, email, password, phoneNumber
      })
      return res.data
    } catch (error) {
      console.error("회원가입 API 호출 중 에러: ", error);
    }
  },

  /** 이메일 중복 확인 */
  emailCheck: async (email: string) => {
    try {
      const res = await axios.post(`${API_URL}/email-check`, {
        email
      })
      return res.data
    } catch (error) {
      console.error("이메일 중복 확인 API 호출 중 에러: ", error);
    }
  },

  /** 인증 번호 요청 */
  certification: async (email: string, clientId: string) => {
    try {
      const res = await axios.post(`${API_URL}/certification`, {
        email,
        clientId
      })
      return res.data
    } catch (error) {
      console.error("인증 번호 요청 API 호출 중 에러: ", error);
    }
  },

  /** 인증 번호 확인 */
  checkCertification: async (email: string, certification: string) => {
    try {
      const res = await fetch(`${API_URL}/check-certification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, certification }),
      });
      const res_json = await res.json()
      return res_json;
    } catch (error) {
      console.error("인증 번호 확인 API 호출 중 에러: ", error);
    }
  }

};

export const infoApi = {
  /** 회원 정보 가져오기 */
  getInfo: (email: string) => {
    return api.post('/member', {
      email
    })
  },

  /** 회원 정보 수정하기 */
  updateInfo: () => {

  },
}