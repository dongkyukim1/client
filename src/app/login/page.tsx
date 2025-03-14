"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { authApi } from "@/services/api";
import LoginComponet from "@/components/login/Login";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  const handleLogin = (provider: string) => {
    authApi.login(provider);
  };

  if (status === "loading") {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <div className="flex items-center justify-around h-dvh">
      <div className="max-md:hidden">
        <h1>로고</h1>
        <span>간단 설명</span>
      </div>
      <LoginComponet />
    </div>
  );
}
