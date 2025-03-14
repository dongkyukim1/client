import React from 'react';
import SectionItem from './common/SectionItem';

export default function PrivacyContent() {
  // 개인정보처리방침 섹션 데이터
  const sections = [
    {
      id: "01",
      title: "개인정보 수집 및 이용 목적",
      content: "TripPlanner AI(이하 '회사')는 다음과 같은 목적으로 개인정보를 수집하고 이용합니다:",
      items: [
        "서비스 제공 및 계정 관리",
        "맞춤형 여행 계획 추천",
        "서비스 개선 및 통계 분석",
        "마케팅 및 광고에 활용 (별도 동의 시)"
      ]
    },
    {
      id: "02",
      title: "수집하는 개인정보 항목",
      content: "회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:",
      items: [
        "필수 항목: 이메일 주소, 이름, 프로필 정보",
        "소셜 로그인 시: 해당 서비스에서 제공하는 정보",
        "선택 항목: 여행 선호도, 관심 지역, 연령대",
        "자동 수집 항목: IP 주소, 쿠키, 접속 기록, 서비스 이용 기록"
      ]
    },
    {
      id: "03",
      title: "개인정보의 보유 및 이용 기간",
      content: "회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 따라 보존해야 하는 경우에는 해당 기간 동안 보관합니다:",
      items: [
        "계약 또는 청약철회 등에 관한 기록: 5년",
        "대금결제 및 재화 등의 공급에 관한 기록: 5년",
        "소비자의 불만 또는 분쟁처리에 관한 기록: 3년",
        "웹사이트 방문 기록: 3개월"
      ]
    },
    {
      id: "04",
      title: "개인정보의 제3자 제공",
      content: "회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:",
      items: [
        "이용자가 사전에 동의한 경우",
        "법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우"
      ]
    },
    {
      id: "05",
      title: "이용자의 권리와 행사 방법",
      content: "이용자는 개인정보 보호법 등 관련 법령에 따라 개인정보의 열람, 정정, 삭제, 처리정지를 요구할 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다."
    }
  ];

  return (
    <div className="text-gray-800">
      <div className="bg-pink-50 p-3 rounded-md mb-6">
        <p className="text-sm text-gray-700">
          최종업데이트 날짜 2025.03.14
        </p>
      </div>
      
      <div className="space-y-6">
        {sections.map((section) => (
          <SectionItem 
            key={section.id}
            id={section.id}
            title={section.title}
            content={section.content}
            items={section.items}
          />
        ))}
      </div>
    </div>
  );
}
