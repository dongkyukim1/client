import FestivalDetail from "@/app/festival/_components/FestivalDetail";
import ModalWrapper from "@/app/festival/_components/ModalWrapper";

export default async function Page({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { id } = params;

  return (
    <ModalWrapper>
      <FestivalDetail id={id} />
    </ModalWrapper>
  );
}
