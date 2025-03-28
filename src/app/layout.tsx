import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/home.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MSWProvider } from "@/components/providers/MSWProvider";


const inter = Inter({ subsets: ["latin"] });

if (process.env.NEXT_PUBLIC_API_MOCKING === "true") {
  import("@/mocks/node").then(({ server }) => {
    server.listen({ onUnhandledRequest: "bypass" });
  });
}

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
        <MSWProvider>
          <NextAuthProvider>
            {children}
            {modal}
            <ToastContainer />
          </NextAuthProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
