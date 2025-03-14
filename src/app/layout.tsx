import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/home.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

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
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          {modal}
        </NextAuthProvider>
      </body>
    </html>
  );
}
