interface Props {
  params: Promise<{ code: string; message: string }>;
}

export default async function FailPage({ params }: Props) {
  const { code, message } = await params;
  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 실패</h2>
        <p>{`에러 코드: ${code}`}</p>
        <p>{`실패 사유: ${message}`}</p>
      </div>
    </div>
  );
}
