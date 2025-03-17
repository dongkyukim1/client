"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { authApi } from "@/services/api";
import LoginComponent from "@/components/login/Login";
import Link from "next/link";

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
        <Link href="/">
          <h1 className="text-3xl lg:text-5xl xl:text-7xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            TripPlanner AI
          </h1>
        </Link>
        <span className="text-sm lg:text-xl xl:text-2xl text-center w-full block text-gray-600 mt-2 tracking-wide">
          최적의 여행 계획을 세워보세요!
        </span>
      </div>
      <LoginComponent handleLogin={handleLogin} />
    </div>
  );
}
