import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
          if (!res.ok) throw new Error("Invalid credentials");
          const user = await res.json().catch(() => null);
          if (!user) throw new Error("Server returned an empty response")
          return user;
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
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 로그인 성공 후 대시보드로 리다이렉션
      return `${baseUrl}/dashboard`;
    },
    async session({ session, token, user }) {
      return session;
    },
    async jwt({ token, user, account, profile }) {
      return token;
    },
  },
});

export { handler as GET, handler as POST }; 