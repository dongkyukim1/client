import axios from 'axios';
import { Resume, CreateResumeRequest, UpdateResumeRequest } from '@/types';
import { getSession, signIn, signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

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

export const authApi = {
  login: (provider: string) => {
    signIn(provider, {
      callbackUrl: '/dashboard'
    }).catch(error => {
      console.error('로그인 오류:', error);
    });
  },

  logout: () => {
    signOut({ callbackUrl: '/' }).catch(error => {
      console.error('로그아웃 오류:', error);
    });
  }
};

/** 회원가입 */
export const signUp = async (nickname: string, email: string, password: string, phoneNumber: string) => {
  try {
    const res = await fetch(`${API_URL}/auth/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, email, password, phoneNumber }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "회원가입에 실패했습니다.");
    }
    return await res.json();
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};