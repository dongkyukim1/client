export default function TermsContent() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">이용약관</h2>
      <p className="text-lg text-gray-600 mb-7 leading-relaxed">
        이 이용약관은 회사가 제공하는 서비스를 이용함에 있어 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
      </p>
      
      <div className="mb-7 p-6 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">제1조 (목적)</h3>
        <p className="text-base text-gray-600 leading-relaxed">
          본 약관은 회사가 제공하는 모든 서비스의 이용조건 및 절차, 이용자와 회사의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
        </p>
      </div>
      
      <div className="mb-7 p-6 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">제2조 (용어의 정의)</h3>
        <p className="text-base text-gray-600 mb-3 leading-relaxed">
          본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-base text-gray-600">
          <li className="leading-relaxed">"서비스"란 회사가 제공하는 모든 서비스를 의미합니다.</li>
          <li className="leading-relaxed">"이용자"란 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
          <li className="leading-relaxed">"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 이용할 수 있는 자를 말합니다.</li>
        </ul>
      </div>
      
      <div className="mb-7 p-6 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">제3조 (약관의 효력 및 변경)</h3>
        <p className="text-base text-gray-600 leading-relaxed">
          <span className="block mb-3">1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력이 발생합니다.</span>
          <span className="block mb-3">2. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 회사 웹사이트에 공지함으로써 효력이 발생합니다.</span>
          <span className="block">3. 이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.</span>
        </p>
      </div>
      
      <div className="mb-7 p-6 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">제4조 (이용계약의 체결)</h3>
        <p className="text-base text-gray-600 leading-relaxed">
          이용계약은 이용자가 본 약관에 동의하고 회사가 정한 양식에 따라 회원정보를 기입한 후 회사가 이를 승인함으로써 체결됩니다.
        </p>
      </div>
    </div>
  );
} 