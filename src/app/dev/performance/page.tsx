'use client';

import React from 'react';

export interface AuthMetric {
  endpoint: string;
  responseTime: number;
  status: number;
  timestamp: number;
}

// 여기만 async 붙여줌!
export default async function PerformancePage() {
  // 임시 데이터
  const authMetrics: AuthMetric[] = [
    {
      endpoint: '/api/auth/login',
      responseTime: 250,
      status: 200,
      timestamp: Date.now()
    },
    {
      endpoint: '/api/auth/register',
      responseTime: 350,
      status: 201,
      timestamp: Date.now() - 3600000
    }
  ];

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">인증 API 성능</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-2">API 엔드포인트</th>
              <th className="pb-2">응답 시간 (ms)</th>
              <th className="pb-2">상태 코드</th>
              <th className="pb-2">측정 시간</th>
            </tr>
          </thead>
          <tbody>
            {authMetrics.map((metric, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-3">{metric.endpoint}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded ${
                    metric.responseTime < 300 ? 'bg-green-100 text-green-800' :
                    metric.responseTime < 1000 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {metric.responseTime.toFixed(2)} ms
                  </span>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded ${
                    metric.status < 300 ? 'bg-green-100 text-green-800' :
                    metric.status < 500 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {metric.status}
                  </span>
                </td>
                <td className="py-3">{new Date(metric.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
