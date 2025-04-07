import { Festival } from "@/types/festival";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";

interface Props {
  festival: Festival;
}

export default function Card({ festival }: Props) {
  const router = useRouter();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleClick = () => {
    router.push(`/festival/detail/${festival.contentid}`, { scroll: false });
  };

  return (
    <div
      ref={ref}
      className="border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-105"
      onClick={handleClick}
    >
      {festival.firstimage && inView ? (
        <img
          src={festival.firstimage || "/default-image.jpg"}
          alt={festival.title}
          className="w-full h-60 object-cover"
        />
      ) : (
        <div className="w-full h-60 flex items-center justify-center">이미지 없음</div>
      )}
      <div className="px-2 py-1">
        <strong className="block font-bold text-xl truncate">{festival.title}</strong>
        <div className="font-normal text-base truncate">
          {festival.eventstartdate} - {festival.eventenddate}
        </div>
        <div className="font-medium text-sm truncate">{festival.addr1}</div>
      </div>
    </div>
  );
}
