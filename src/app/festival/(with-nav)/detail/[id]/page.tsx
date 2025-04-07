import FestivalDetail from "@/app/festival/_components/FestivalDetail";
import getDetailCommon from "@/app/festival/_services/getDetailCommon";
import { DetailCommonResponse } from "@/types/festival";

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const detailCommonResponse: DetailCommonResponse = await getDetailCommon(id);
  const { title, overview, firstimage2 } = detailCommonResponse.response.body.items.item[0];
  return {
    title,
    description: overview,
    openGraph: {
      title,
      description: overview,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/festival/detail/${id}`,
      images: [
        {
          url: firstimage2,
          width: 150,
          height: 100,
          alt: `${title} 썸네일 이미지`,
        },
      ],
    },
  };
}

interface Props {
  params: { id: string };
}

export default async function Detail({ params }: Props) {
  const { id } = await params;
  return <FestivalDetail id={id} />;
}
