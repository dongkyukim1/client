import axios from 'axios';
import { Resume, CreateResumeRequest, UpdateResumeRequest } from '@/types';
import { getSession, signOut } from 'next-auth/react';

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

export const resumeApi = {
  create: (data: CreateResumeRequest) =>
    api.post<Resume>('/api/resumes', data),

  getAll: () =>
    api.get<Resume[]>('/api/resumes'),

  getById: (id: number) =>
    api.get<Resume>(`/api/resumes/${id}`),

  update: (id: number, data: UpdateResumeRequest) =>
    api.put<Resume>(`/api/resumes/${id}`, data),
};

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

  /** 인증 번호 확인 */
  certification: async (certification: string) => {
    try {
      const res = await axios.post(`${API_URL}/certification`, {
        certification
      })
      return res.data
    } catch (error) {
      console.error("인증 번호 확인 API 호출 중 에러: ", error);
    }
  },

};