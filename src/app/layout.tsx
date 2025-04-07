"use client";

import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/home.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MSWProvider } from "@/components/providers/MSWProvider";
import dynamic from "next/dynamic";
import RQProvider from "@/components/providers/RQProvider";

const KakaoScript = dynamic(() => import("../components/KakaoScript"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_MOCKING === "true") {
  import("@/mocks/node").then(({ server }) => {
    server.listen();
  });
}

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
        <KakaoScript />
        <MSWProvider>
          <NextAuthProvider>
            <RQProvider>
              {React.Children.map(children, (child, i) =>
                React.isValidElement(child) ? React.cloneElement(child, { key: `child-${i}` }) : child
              )}
              {React.Children.map(modal, (child, i) =>
                React.isValidElement(child) ? React.cloneElement(child, { key: `modal-${i}` }) : child
              )}
              <ToastContainer />
            </RQProvider>
          </NextAuthProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
