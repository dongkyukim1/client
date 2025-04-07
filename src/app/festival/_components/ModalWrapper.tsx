"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function ModalWrapper({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <>
      <div className="fixed top-0 w-dvw h-dvh bg-black opacity-10 z-[100]" />
      <div className="fixed top-0 w-dvw h-dvh flex items-center justify-center z-[100]" onClick={() => router.back()}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full md:w-1/2 h-full md:h-[calc(100dvh-100px)] md:rounded-lg overflow-y-scroll bg-white"
        >
          {children}
        </div>
      </div>
    </>
  );
}
