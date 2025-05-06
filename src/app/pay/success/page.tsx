"use client";

import { paymentApi } from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  params: Promise<{ orderId: string; amount: string; paymentKey: string }>;
}

export default async function SuccessPage({ params }: Props) {
  const router = useRouter();
  const { orderId, amount, paymentKey } = await params;

  useEffect(() => {
    async function pay() {
      // todo api 연결 후 오는 값 활용 하여 로직 적용
      const payTempCheckRes = paymentApi.payTempCheck(orderId, amount);
      const payConfirmRes = await paymentApi.payConfirm(paymentKey, orderId, amount);

      if (payConfirmRes.data.code !== "SU") {
        // 결제 실패 비즈니스 로직을 구현하세요.
        router.push(`/pay/fail?message=${payConfirmRes.data.message}&code=${payConfirmRes.data.code}`);
        return;
      }

      // 결제 성공 비즈니스 로직을 구현하세요.
    }
    pay();
  }, []);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${orderId}`}</p>
        <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${paymentKey}`}</p>
      </div>
    </div>
  );
}
