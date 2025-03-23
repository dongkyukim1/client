import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User as NextAuthUser } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * NextAuth 설정
 * @see https://next-auth.js.org/configuration/options
 */
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });
          
          if (!res.ok) {
            console.error("Login failed with status:", res.status);
            throw new Error("Invalid credentials");
          }
          
          const user = await res.json();
          console.log("Login response:", user);
          
          if (!user) throw new Error("Server returned an empty response");
          
          // 서버 응답 형식에 맞게 사용자 객체 구성
          return {
            id: user.memberId || user.id || "1",
            email: user.email,
            name: user.nickname || user.name,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    NaverProvider({
      clientId: process.env.NAVER_ID || "",
      clientSecret: process.env.NAVER_SECRET || "",
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_ID || "",
      clientSecret: process.env.KAKAO_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  callbacks: {
    async redirect() {
      // 로그인 성공 후 대시보드로 리다이렉션
      return "/dashboard";
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as NextAuthUser;
        token.accessToken = typedUser.accessToken;
        token.refreshToken = typedUser.refreshToken;
        token.id = typedUser.id;
      }
      return token;
    },
  },
});

// 경로 핸들러 내보내기
export { handler as GET, handler as POST }; 