import React from 'react';
import SectionItem from './common/SectionItem';

export default function TermsContent() {
  // 이용약관 섹션 데이터
  const sections = [
    {
      id: "01",
      title: "서비스 이용약관",
      content: "TripPlanner AI(이하 '서비스')의 이용약관에 오신 것을 환영합니다. 본 약관은 서비스 이용에 관한 권리와 의무를 규정합니다. 본 서비스를 이용함으로써 이용자는 본 약관에 동의하는 것으로 간주됩니다."
    },
    {
      id: "02",
      title: "서비스 내용",
      content: "TripPlanner AI는 사용자에게 AI 기반 여행 계획 추천 서비스를 제공합니다. 서비스의 구체적인 내용은 다음과 같습니다:",
      items: [
        "AI 여행 코스 추천 서비스",
        "개인 맞춤형 여행 계획 작성",
        "인기 여행지 정보 제공",
        "여행 계획 저장 및 관리"
      ]
    },
    {
      id: "03",
      title: "이용자의 의무",
      content: "이용자는 다음 사항을 준수해야 합니다:",
      items: [
        "타인의 권리를 침해하거나 법을 위반하는 행위를 하지 않을 것",
        "서비스의 정상적인 운영을 방해하지 않을 것",
        "다른 이용자에게 피해를 주는 행위를 하지 않을 것",
        "허위 정보를 등록하지 않을 것"
      ]
    },
    {
      id: "04",
      title: "서비스 이용 제한",
      content: "회사는 다음과 같은 경우 이용자의 서비스 이용을 제한하거나 계정을 삭제할 수 있습니다:",
      items: [
        "이용약관을 위반하는 경우",
        "불법적인 활동에 서비스를 이용하는 경우",
        "타인의 정보를 도용하는 경우",
        "서비스의 안정적 운영을 방해하는 경우"
      ]
    },
    {
      id: "05",
      title: "서비스 변경 및 중단",
      content: "회사는 서비스의 내용, 이용 방법, 이용 시간에 대하여 변경, 중단할 수 있습니다. 서비스의 변경 및 중단이 있는 경우에는 사전에 공지하나, 불가피한 사유가 있는 경우 사후에 공지할 수 있습니다."
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
