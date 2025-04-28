import FestivalDetail from "@/app/festival/_components/FestivalDetail";
import ModalWrapper from "@/app/festival/_components/ModalWrapper";
import type { Metadata } from 'next';

type PageParams = {
  id: string;
};

export default function Page(props: any) {
  const id = props.params.id;

  return (
    <ModalWrapper>
      <FestivalDetail id={id} />
    </ModalWrapper>
  );
}
