import { DetailCommonResponse, DetailImageResponse, DetailInfoResponse, DetailIntroResponse } from "@/types/festival";
import getDetailCommon from "../_services/getDetailCommon";
import getDetailIntro from "../_services/getDetailIntro";
import getDetailInfo from "../_services/getDetailInfo";
import getDetailImage from "../_services/getDetailImage";
import ImageSwiper from "./ImageSwiper";
import { Fragment } from "react";

interface Props {
  id: string;
}

export default async function FestivalDetail({ id }: Props) {
  const [detailCommonResponse, detailIntroResponse, detailInfoResponse, detailImageResponse]: [
    DetailCommonResponse,
    DetailIntroResponse,
    DetailInfoResponse,
    DetailImageResponse
  ] = await Promise.all([getDetailCommon(id), getDetailIntro(id), getDetailInfo(id), getDetailImage(id)]);

  const { title, homepage } = detailCommonResponse.response.body.items.item[0];
  const {
    playtime,
    eventstartdate,
    eventenddate,
    eventplace,
    spendtimefestival,
    usetimefestival,
    sponsor1,
    sponsor1tel,
    sponsor2,
    sponsor2tel,
  } = detailIntroResponse.response.body.items.item[0];
  const items = detailInfoResponse?.response?.body?.items?.item ?? [];
  const infos = items.map((item) => ({ infoname: item?.infoname ?? "", infotext: item?.infotext ?? "" }));
  const images = detailImageResponse.response.body.items.item ?? [];
  console.log(detailImageResponse);

  const setTitleContent = (title: string, content: string) => {
    if (!content) return null;
    return (
      <Fragment key={title}>
        <h4>{title}</h4>
        <p dangerouslySetInnerHTML={{ __html: content }} />
      </Fragment>
    );
  };

  return (
    <div className="size-full p-3">
      {title ? <h1>{title}</h1> : null}
      <ImageSwiper images={images} />
      {infos.map((info) => setTitleContent(info.infoname, info.infotext))}
      {eventstartdate && eventenddate ? (
        <>
          <h4>기간</h4>
          <p>
            {eventstartdate} ~ {eventenddate}
          </p>
        </>
      ) : null}
      {setTitleContent("시간", playtime)}
      {homepage ? (
        <>
          <h4>홈페이지</h4>
          <p dangerouslySetInnerHTML={{ __html: homepage! }} className="underline text-blue-500" />
        </>
      ) : null}
      {setTitleContent("행사 장소", eventplace)}
      {setTitleContent("관람 소요 시간", spendtimefestival)}
      {setTitleContent("이용 요금", usetimefestival)}
      {setTitleContent("주최", sponsor1)}
      {setTitleContent("주최 연락처", sponsor1tel)}
      {setTitleContent("주관", sponsor2)}
      {setTitleContent("주관 연락처", sponsor2tel)}
    </div>
  );
}
