import FestivalDetail from "@/app/festival/_components/FestivalDetail";
import ModalWrapper from "@/app/festival/_components/ModalWrapper";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <ModalWrapper>
      <FestivalDetail id={id} />
    </ModalWrapper>
  );
}
