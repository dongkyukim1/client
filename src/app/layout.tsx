import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/home.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KakaoScript from '@/components/KakaoScript';
// Kakao 타입은 자체 타입 파일에 정의되어 있습니다

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "여행 플래너",
  description: "AI가 추천하는 맞춤형 여행 계획",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <KakaoScript />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          {modal}
          <ToastContainer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
