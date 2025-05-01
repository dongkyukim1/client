"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Image,
  Badge,
  Button,
  SimpleGrid,
  Icon,
  Spinner,
  VStack,
  HStack,
  List,
  ListItem,
  ListIcon,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaChevronLeft,
  FaBus,
  FaWallet,
  FaCheckCircle,
  FaStar,
  FaCalendarAlt,
  FaInfoCircle,
  FaBed,
  FaUtensils,
  FaTicketAlt,
  FaMoneyBill,
  FaUmbrella,
  FaCar,
  FaCloudSun,
  FaRestroom,
  FaHome,
  FaWonSign,
  FaPlane,
} from "react-icons/fa";
import Script from "next/script";
import NavSection from "@/components/common/NavSection";
import Footer from "@/components/common/Footer";
import Link from "next/link";

// 여행 코스 타입 정의
type TravelCourse = {
  id: number;
  title: string;
  region: string;
  duration: string;
  imageUrls: string[];
  rating: number;
  reviewCount: number;
  likes: number;
  description: string;
  transportation: string;
  budget: string;
  spots: SpotDetail[];
  tags: string[];
  tips: string[];
};

type SpotDetail = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  visitDuration: string;
  day: number;
  timeSlot: "오전" | "오후" | "저녁";
  category: "attraction" | "restaurant" | "activity";
};

// 임시 데이터
const MOCK_TRAVEL_COURSES: Record<string, TravelCourse> = {
  "1": {
    id: 1,
    title: "제주도 3박 4일 필수 코스",
    region: "제주특별자치도",
    duration: "3박 4일",
    imageUrls: [
      "/images/popular/성산일출봉.jpg",
      "/images/popular/우도.jpg",
      "/images/popular/섭지코지.jpg",
      "/images/popular/한라산.jpg",
      "/images/popular/협재해변.jpg",
    ],
    rating: 4.8,
    reviewCount: 235,
    likes: 892,
    description:
      "제주도의 아름다운 자연과 문화를 모두 경험할 수 있는 최적의 3박 4일 코스입니다. 동쪽의 성산일출봉, 서쪽의 협재해변, 남쪽의 카페들, 그리고 제주 시내까지 제주도의 모든 매력을 담았습니다. 렌터카를 이용하면 더욱 편리하게 여행할 수 있습니다.",
    transportation: "렌터카 (하루 약 50,000원) 또는 대중교통 (버스 + 택시)",
    budget: "1인 기준 약 600,000원 (숙박, 식비, 교통비, 입장료 포함)",
    spots: [
      {
        id: "s1",
        name: "성산일출봉",
        description:
          "유네스코 세계자연유산으로 등재된 제주의 대표 명소. 일출 명소로 유명하며, 분화구와 주변 경관이 아름답습니다.",
        imageUrl: "/images/popular/성산일출봉.jpg",
        address: "제주특별자치도 서귀포시 성산읍 일출로 284-12",
        visitDuration: "약 2시간",
        day: 1,
        timeSlot: "오전",
        category: "attraction",
      },
      {
        id: "s2",
        name: "우도",
        description:
          "제주 동쪽에 위치한 작은 섬으로, 아름다운 해변과 경관을 즐길 수 있습니다. 자전거나 전기차를 빌려 섬을 돌아보는 것이 좋습니다.",
        imageUrl: "/images/popular/우도.jpg",
        address: "제주특별자치도 제주시 우도면",
        visitDuration: "약 4시간",
        day: 1,
        timeSlot: "오후",
        category: "attraction",
      },
      {
        id: "s3",
        name: "섭지코지",
        description: "바다로 뻗어나간 지형과 유채꽃, 그리고 등대가 어우러진 아름다운 해안가입니다.",
        imageUrl: "/images/popular/섭지코지.jpg",
        address: "제주특별자치도 서귀포시 성산읍 섭지코지로",
        visitDuration: "약 1시간 30분",
        day: 1,
        timeSlot: "저녁",
        category: "attraction",
      },
      {
        id: "s4",
        name: "한라산 국립공원",
        description:
          "제주도의 중심에 있는 한라산은 대한민국에서 가장 높은 산으로, 다양한 등산로를 통해 정상을 오를 수 있습니다.",
        imageUrl: "/images/popular/한라산.jpg",
        address: "제주특별자치도 제주시 1100로 2070-61",
        visitDuration: "약 6시간",
        day: 2,
        timeSlot: "오전",
        category: "activity",
      },
      {
        id: "s6",
        name: "협재해변",
        description:
          "맑은 에메랄드빛 바다와 백사장이 아름다운 해변으로, 여름철 해수욕과 사계절 풍경 감상이 가능합니다.",
        imageUrl: "/images/popular/협재해변.jpg",
        address: "제주특별자치도 제주시 한림읍 협재리",
        visitDuration: "약 3시간",
        day: 3,
        timeSlot: "오전",
        category: "attraction",
      },
    ],
    tags: ["자연경관", "오션뷰", "인생샷", "드라이브", "해변", "산책"],
    tips: [
      "제주도는 날씨 변화가 심하니 여벌의 옷을 준비하세요.",
      "렌터카를 이용하면 더 효율적으로 여행할 수 있습니다.",
      "성수기에는 미리 숙소를 예약하는 것이 좋습니다.",
      "제주 현지 음식인 갈치조림, 흑돼지, 고등어회를 꼭 드셔보세요.",
      "관광지마다 입장료가 있으니 예산을 충분히 준비하세요.",
    ],
  },
};

// 시간대에 맞는 색상 반환 함수
const getTimeSlotColor = (timeSlot: "오전" | "오후" | "저녁") => {
  switch (timeSlot) {
    case "오전":
      return { bg: "#FFB6C1", text: "black" }; // 밝은 핑크색
    case "오후":
      return { bg: "#FF69B4", text: "white" }; // 핫 핑크색
    case "저녁":
      return { bg: "#DB7093", text: "white" }; // 진한 핑크색
    default:
      return { bg: "#FFDEEB", text: "black" };
  }
};

export default function TravelCourseDetail() {
  // 하드코딩된 ID를 사용하여 문제 우회
  const MOCK_ID = "1"; // 임시 해결책으로 하드코딩된 ID 사용

  const [travelCourse, setTravelCourse] = useState<TravelCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const cardsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [hoverStyles, setHoverStyles] = useState("");
  const router = useRouter();

  // 애니메이션 관련 상태
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const [visibleInfoSection, setVisibleInfoSection] = useState(true);
  const [visibleTipsSection, setVisibleTipsSection] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 임시 데이터 사용 - 하드코딩된 ID 활용
        setTimeout(() => {
          const courseData = MOCK_TRAVEL_COURSES[MOCK_ID];
          if (courseData) {
            setTravelCourse(courseData);
          }
          setIsLoading(false);
        }, 400);
      } catch (error) {
        console.error("여행 코스 데이터 가져오기 실패:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 인터섹션 옵저버 설정
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    };

    // 관광 명소 카드 관찰
    const spotObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // ID에서 'spot-' 접두사를 제거하고 저장
          const spotId = entry.target.id.replace("spot-", "");
          setVisibleCards((prev) => {
            if (!prev.includes(spotId)) {
              return [...prev, spotId];
            }
            return prev;
          });
        }
      });
    }, observerOptions);

    // 여행 정보 섹션 관찰
    const infoSectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleInfoSection(true);
        }
      });
    }, observerOptions);

    // 여행 팁 섹션 관찰
    const tipsSectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleTipsSection(true);
        }
      });
    }, observerOptions);

    // DOM 요소들에 옵저버 적용
    if (travelCourse) {
      travelCourse.spots.forEach((spot) => {
        const element = document.getElementById(`spot-${spot.id}`);
        if (element) spotObserver.observe(element);
      });

      const infoSection = document.getElementById("travel-info-section");
      if (infoSection) infoSectionObserver.observe(infoSection);

      const tipsSection = document.getElementById("travel-tips-section");
      if (tipsSection) tipsSectionObserver.observe(tipsSection);
    }

    return () => {
      spotObserver.disconnect();
      infoSectionObserver.disconnect();
      tipsSectionObserver.disconnect();
    };
  }, [travelCourse]);

  // 카드 호버 효과 핸들러
  const handleCardMouseMove = (e: React.MouseEvent, cardId: string) => {
    if (!cardsRef.current[cardId]) return;

    const $card = cardsRef.current[cardId];
    if (!$card) return;

    // 마우스 위치 계산
    const rect = $card.getBoundingClientRect();
    const l = e.clientX - rect.left;
    const t = e.clientY - rect.top;
    const h = rect.height;
    const w = rect.width;

    const px = Math.abs(Math.floor((100 / w) * l) - 100);
    const py = Math.abs(Math.floor((100 / h) * t) - 100);

    // 그라데이션 위치 계산
    const lp = 50 + (px - 50) / 1.5;
    const tp = 50 + (py - 50) / 1.5;
    const px_spark = 50 + (px - 50) / 7;
    const py_spark = 50 + (py - 50) / 7;
    const p_opc = 20 + Math.abs(50 - px + (50 - py)) * 1.5;
    const ty = ((tp - 50) / 2) * -1;
    const tx = ((lp - 50) / 1.5) * 0.5;

    // CSS 스타일 적용
    const gradPos = `background-position: ${lp}% ${tp}%`;
    const sparkPos = `background-position: ${px_spark}% ${py_spark}%`;
    const opc = `opacity: ${p_opc / 100}`;
    const transform = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`;

    $card.style.cssText = transform;

    // 가상 요소에 적용할 스타일
    const style = `
      .travel-card[data-id="${cardId}"]:before { ${gradPos} }
      .travel-card[data-id="${cardId}"]:after { ${sparkPos} ${opc} }
    `;

    setHoveredCardId(cardId);
    setHoverStyles(style);
  };

  const handleCardMouseLeave = (cardId: string) => {
    if (!cardsRef.current[cardId]) return;

    const $card = cardsRef.current[cardId];
    if (!$card) return;

    $card.style.cssText = "";
    setHoveredCardId(null);
    setHoverStyles("");
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: travelCourse?.title,
          text: `${travelCourse?.title} - ${travelCourse?.region}의 ${travelCourse?.duration} 여행 코스`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  // CSS 애니메이션 스타일
  const fadeInUpAnimation = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .fade-in-up {
      animation: fadeInUp 0.7s ease forwards;
    }
    
    .delay-1 {
      animation-delay: 0.2s;
    }
    
    .delay-2 {
      animation-delay: 0.4s;
    }
    
    .delay-3 {
      animation-delay: 0.6s;
    }
    
    .delay-4 {
      animation-delay: 0.8s;
    }
    
    .delay-5 {
      animation-delay: 1s;
    }
  `;

  // 로딩 상태
  if (isLoading) {
    return (
      <>
        <NavSection />
        <Flex h="100vh" justify="center" align="center" bg="white">
          <Spinner size="xl" color="pink.400" />
        </Flex>
        <Footer />
      </>
    );
  }

  // 데이터 없음 상태
  if (!travelCourse) {
    return (
      <>
        <NavSection />
        <Box minH="100vh" py={8} bg="white">
          <Container maxW="container.md">
            <Flex direction="column" align="center" justify="center" py={20}>
              <Heading mb={6} color="gray.700">
                여행 코스를 찾을 수 없습니다
              </Heading>
              <Button
                leftIcon={<FaChevronLeft />}
                onClick={() => router.push("/travel/popular")}
                colorScheme="pink"
                borderRadius="md"
              >
                모든 코스 보기
              </Button>
            </Flex>
          </Container>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavSection />
      <Box backgroundColor="white" minH="100vh" pt="100px">
        {/* 스타일 주입 */}
        <style jsx global>{`
          ${fadeInUpAnimation}

          :root {
            --color1: #ff69b4;
            --color2: #ffb6c1;
          }

          .travel-card {
            width: 280px;
            height: 380px;
            position: relative;
            overflow: hidden;
            margin: 12px;
            z-index: 10;
            touch-action: none;
            border-radius: 16px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            background-color: #f8f9fa;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: 50% 50%;
            transform-origin: center;
            will-change: transform;
          }

          .travel-card:hover {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          }

          .travel-card:before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            background-repeat: no-repeat;
            background-position: 50% 50%;
            background-size: 300% 300%;
            background-image: linear-gradient(
              115deg,
              transparent 0%,
              var(--color1) 25%,
              transparent 47%,
              transparent 53%,
              var(--color2) 75%,
              transparent 100%
            );
            opacity: 0.3;
            z-index: 1;
            transition: opacity 0.3s ease;
          }

          .travel-card:hover:before {
            opacity: 0.5;
          }

          .card-container {
            perspective: 1000px;
          }

          .detail-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(60, 60, 70, 0.85);
            color: white;
            padding: 20px;
            transform: translateY(100%);
            transition: transform 0.3s ease;
            z-index: 3;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
          }

          .travel-card:hover .detail-overlay {
            transform: translateY(0);
          }

          .day-badge {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            border-radius: 20px;
            padding: 0;
            font-size: 15px;
            font-weight: bold;
            z-index: 4;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 105, 180, 0.4);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            min-width: unset;
            width: auto;
            line-height: 1;
            height: 24px;
          }

          .day-badge > span {
            margin-top: 0;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .time-badge {
            position: absolute;
            top: 10px;
            right: 12px;
            padding: 0px 10px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            z-index: 4;
            backdrop-filter: blur(2px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            line-height: 1;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .address-text {
            font-size: 13px;
            line-height: 1.5;
            opacity: 0.9;
            margin-bottom: 12px;
            color: #e8e8e8;
            padding-left: 2px;
            display: flex;
            align-items: flex-start;
          }

          .address-text svg {
            margin-right: 5px;
            margin-top: 3px;
            flex-shrink: 0;
          }

          .desc-text {
            font-size: 14px;
            line-height: 1.6;
            font-weight: 400;
            letter-spacing: 0.3px;
            color: #ffffff;
            max-height: 110px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
          }

          .duration-text {
            background: rgba(255, 105, 180, 0.25);
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            margin-top: 10px;
            color: #ffdeeb;
            border: 1px solid rgba(255, 105, 180, 0.3);
          }

          .duration-text svg {
            margin-right: 5px;
          }

          .duration-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            background: rgba(255, 182, 193, 0.9);
            color: #333;
            margin-top: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.4);
            width: fit-content;
            position: relative;
            list-style-type: none;
          }

          .duration-badge::before {
            content: none !important;
          }

          .duration-badge svg {
            margin-right: 6px;
          }

          .spot-title {
            font-size: 19px;
            font-weight: 600;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #ffb6c1;
          }

          .course-overview {
            background: #f9f9f9;
            border-radius: 16px;
            padding: 20px 25px;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(255, 105, 180, 0.2);
            position: relative;
          }

          .course-overview:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(to right, #ff69b4, #ffb6c1);
            border-radius: 16px 16px 0 0;
          }

          .overview-icon {
            position: absolute;
            top: -15px;
            right: 20px;
            background: white;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            border: 2px solid #ffb6c1;
            color: #ff69b4;
          }

          /* 가격표 스타일 카드 */
          .price-card {
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 360px;
          }

          .price-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          }

          .price-card-header {
            padding: 18px;
            color: white;
            text-align: center;
            flex-shrink: 0;
          }

          .price-card-body {
            padding: 24px;
            background: white;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .price-card-price {
            font-size: 3rem;
            font-weight: 700;
            color: white;
            text-align: center;
            margin-bottom: 10px;
          }

          .price-card-description {
            color: rgba(255, 255, 255, 0.9);
            text-align: center;
            font-size: 0.9rem;
          }

          .price-card-feature {
            display: flex;
            align-items: center;
            margin-bottom: 14px;
          }

          /* 팁 카드 스타일 */
          .tip-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .tip-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          }

          .tip-card-header {
            padding: 18px;
            background: #ffb3c1;
            color: white;
            text-align: center;
          }

          .tip-card-body {
            padding: 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
          }

          .tip-list-item {
            display: flex;
            align-items: flex-start;
            padding: 12px;
            margin-bottom: 10px;
            background: #f9f9f9;
            border-radius: 8px;
            border-left: 3px solid #ffb3c1;
          }

          .tip-list-item:last-child {
            margin-bottom: 0;
          }
        `}</style>

        <Container maxW={{ base: "95%", md: "container.xl" }} py={6}>
          {/* 여행 코스 제목 및 기본 정보 */}
          <Box textAlign="center" color="gray.700" mb={6} mx="auto" maxW="800px">
            <HStack spacing={3} justify="center" mb={1}>
              <Image src="/images/popular/map_pin.png" alt="지역" boxSize="28px" />
              <Text fontSize="sm" color="gray.600">
                {travelCourse.region}
              </Text>
            </HStack>

            <Heading
              as="h1"
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="bold"
              mb={3}
              color="pink.500"
              lineHeight="1.3"
              px={2}
              wordBreak="keep-all"
            >
              {travelCourse.title}
            </Heading>

            <Flex justify="center" align="center" mb={3} wrap="wrap">
              <Flex align="center" mr={6} mb={{ base: 2, md: 0 }}>
                <Image src="/images/popular/Time.png" alt="시간" boxSize="26px" mr={2} />
                <Text>{travelCourse.duration}</Text>
              </Flex>

              <Flex align="center">
                <Image src="/images/popular/star.png" alt="별점" boxSize="26px" mr={2} />
                <Text>
                  {travelCourse.rating} ({travelCourse.reviewCount})
                </Text>
              </Flex>
            </Flex>
          </Box>

          {/* 코스 개요 */}
          <Box className="course-overview" mb={10} mx="auto" maxW="850px">
            <div className="overview-icon">
              <Icon as={FaInfoCircle} boxSize={5} />
            </div>

            <Text
              color="gray.700"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.8"
              letterSpacing="0.2px"
              fontWeight="400"
            >
              {travelCourse.description}
            </Text>

            <Flex wrap="wrap" justify="center" gap={2} mt={4}>
              {travelCourse.tags.map((tag) => (
                <Badge key={tag} colorScheme="pink" variant="subtle" px={3} py={1} borderRadius="full">
                  {tag}
                </Badge>
              ))}
            </Flex>
          </Box>

          {/* 홀로그램 카드 섹션 */}
          <Heading as="h2" fontSize="xl" fontWeight="bold" mb={8} color="pink.500" textAlign="center">
            주요 관광 명소
          </Heading>

          <Flex flexWrap="wrap" justify="center" align="stretch" mx="auto" gap={4} mb={12}>
            {travelCourse?.spots.map((spot, index) => {
              const timeColors = getTimeSlotColor(spot.timeSlot);
              const isVisible = visibleCards.includes(spot.id);

              return (
                <Box
                  key={spot.id}
                  id={`spot-${spot.id}`}
                  className={`card-container fade-in-up ${isVisible ? "visible" : ""}`}
                  position="relative"
                  style={{
                    transitionDelay: `${index * 2}s`,
                  }}
                >
                  <Box
                    ref={(el: HTMLDivElement | null) => {
                      cardsRef.current[spot.id] = el;
                    }}
                    className="travel-card"
                    data-id={spot.id}
                    backgroundImage={`url(${spot.imageUrl})`}
                    position="relative"
                    onMouseMove={(e) => handleCardMouseMove(e, spot.id)}
                    onMouseLeave={() => handleCardMouseLeave(spot.id)}
                  >
                    {/* Day 뱃지 */}
                    <Flex className="day-badge">
                      <span>Day {spot.day}</span>
                    </Flex>

                    {/* 시간대 뱃지 */}
                    <Flex className="time-badge" bg={timeColors.bg} color={timeColors.text}>
                      {spot.timeSlot}
                    </Flex>

                    {/* 호버 시 상세 정보 */}
                    <Box className="detail-overlay">
                      <Flex align="center" justify="space-between" mb={2}>
                        <Text className="spot-title" flex="1" mr={2} isTruncated>
                          {spot.name}
                        </Text>
                        <Text
                          color="#FFB6C1"
                          fontSize="14px"
                          fontWeight="500"
                          display="flex"
                          alignItems="center"
                          flexShrink={0}
                        >
                          <Image src="/images/popular/Time.png" alt="소요시간" width="24px" height="24px" mr={2} />
                          {(() => {
                            // 모든 점, 불릿, 공백 등 제거
                            return spot.visitDuration
                              .replace(/[.•]/g, "") // 모든 점과 불릿 제거
                              .replace(/^\s+/, "") // 앞쪽 공백 제거
                              .replace(/\s+약/, " 약") // 약 앞에 공백 한 칸만 두기
                              .trim(); // 앞뒤 공백 모두 제거
                          })()}
                        </Text>
                      </Flex>

                      <Flex className="address-text">
                        <Image
                          src="/images/popular/map_pin.png"
                          alt="위치"
                          width="22px"
                          height="22px"
                          mr={2}
                          mt="2px"
                        />
                        <Text>{spot.address}</Text>
                      </Flex>

                      <Text className="desc-text">
                        {spot.description.length > 150 ? `${spot.description.substring(0, 140)}...` : spot.description}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Flex>

          {/* 여행 정보 섹션 헤더 */}
          <Box mb={8} id="travel-info-section">
            <Flex align="center" justify="center">
              <Box h="1px" bg="gray.200" flex="1" maxW="300px" />
              <Heading as="h2" fontSize="xl" fontWeight="bold" mx={4} color="pink.500" textAlign="center">
                여행 정보
              </Heading>
              <Box h="1px" bg="gray.200" flex="1" maxW="300px" />
            </Flex>
          </Box>

          {/* 여행 정보 섹션 - 가격표 스타일 */}
          <Box mx="auto" maxW="1300px" mb={5} px={{ base: 4, md: 0 }}>
            <Flex
              flexWrap={{ base: "wrap", lg: "nowrap" }}
              justify="space-evenly"
              align="flex-start"
              mx="auto"
              gap={{ base: 30, lg: 10 }}
              position="relative"
            >
              {/* 교통 정보 카드 */}
              <Box
                className="price-card fade-in-up delay-1"
                width={{ base: "100%", sm: "45%", lg: "19%" }}
                maxWidth={{ base: "260px", lg: "210px" }}
                minH="400px"
                flexShrink={0}
              >
                <Box className="price-card-header" bg="#8dd3c7">
                  <Heading size="md" mb={4}>
                    교통 정보
                  </Heading>
                  <Box className="price-card-price">
                    <Flex align="center" justify="center">
                      <Image src="/images/popular/cash.png" alt="비용" width="40px" height="40px" mr={3} />
                      <Text>50,000</Text>
                    </Flex>
                  </Box>
                  <Text className="price-card-description">하루 렌터카 비용</Text>
                </Box>

                <Box className="price-card-body">
                  <VStack spacing={5} align="stretch">
                    <Box className="price-card-feature">
                      <Icon as={FaCar} color="#8dd3c7" boxSize={5} mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          렌터카
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          도내 전 지역 자유롭게 이동
                        </Text>
                      </Box>
                    </Box>

                    <Box className="price-card-feature">
                      <Icon as={FaBus} color="#8dd3c7" boxSize={5} mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          대중교통
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          버스 + 택시 조합 가능
                        </Text>
                      </Box>
                    </Box>

                    <Box className="price-card-feature">
                      <Icon as={FaPlane} color="#8dd3c7" boxSize={5} mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          왕복 항공권
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          평균 150,000원/인
                        </Text>
                      </Box>
                    </Box>
                  </VStack>
                </Box>
              </Box>

              {/* 예산 정보 카드 */}
              <Box
                className="price-card fade-in-up delay-2"
                width={{ base: "100%", sm: "45%", lg: "19%" }}
                maxWidth={{ base: "260px", lg: "210px" }}
                minH="400px"
                flexShrink={0}
              >
                <Box className="price-card-header" bg="#80b1d3">
                  <Heading size="md" mb={4}>
                    예산 정보
                  </Heading>
                  <Box className="price-card-price">
                    <Flex align="center" justify="center">
                      <Image src="/images/popular/cash.png" alt="비용" width="40px" height="40px" mr={3} />
                      <Text>600,000</Text>
                    </Flex>
                  </Box>
                  <Text className="price-card-description">1인 기준 총 비용</Text>
                </Box>

                <Box className="price-card-body">
                  <VStack spacing={5} align="stretch">
                    <Box className="price-card-feature">
                      <Icon as={FaBed} color="#80b1d3" boxSize={5} mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          숙박비
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          3박 평균 240,000원
                        </Text>
                      </Box>
                    </Box>

                    <Box className="price-card-feature">
                      <Icon as={FaUtensils} color="#80b1d3" boxSize={5} mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          식비
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          하루 평균 50,000원
                        </Text>
                      </Box>
                    </Box>

                    <Box className="price-card-feature">
                      <Icon as={FaTicketAlt} color="#80b1d3" boxSize={5} mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          입장료
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          주요 명소 약 60,000원
                        </Text>
                      </Box>
                    </Box>
                  </VStack>
                </Box>
              </Box>

              {/* 추천 시기 카드 */}
              <Box
                className="price-card fade-in-up delay-3"
                width={{ base: "100%", sm: "45%", lg: "19%" }}
                maxWidth={{ base: "260px", lg: "210px" }}
                minH="400px"
                flexShrink={0}
              >
                <Box className="price-card-header" bg="#fb8072">
                  <Heading size="md" mb={4}>
                    추천 시기
                  </Heading>
                  <Box className="price-card-price">
                    <Flex align="center" justify="center">
                      <Image src="/images/popular/Weather.png" alt="날씨" width="48px" height="48px" mr={3} />
                      <Text>봄/가을</Text>
                    </Flex>
                  </Box>
                  <Text className="price-card-description">3-5월, 9-11월 추천</Text>
                </Box>

                <Box className="price-card-body">
                  <VStack spacing={5} align="stretch">
                    <Box className="price-card-feature">
                      <Icon as={FaCloudSun} color="#fb8072" boxSize={5} mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          최적 날씨
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          맑은 날씨, 쾌적한 기온
                        </Text>
                      </Box>
                    </Box>

                    <Box className="price-card-feature">
                      <Icon as={FaUmbrella} color="#fb8072" boxSize={5} mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          우천 대비
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          방수 의류와 우산 준비
                        </Text>
                      </Box>
                    </Box>

                    <Box className="price-card-feature">
                      <Icon as={FaCalendarAlt} color="#fb8072" boxSize={5} mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          방문 기간
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          최소 3박 4일 권장
                        </Text>
                      </Box>
                    </Box>
                  </VStack>
                </Box>
              </Box>

              {/* 알아두면 좋은 팁 카드 - 넓게 배치 */}
              {travelCourse?.tips && travelCourse.tips.length > 0 && (
                <Box
                  className="price-card fade-in-up delay-4"
                  width={{ base: "100%", sm: "94%", lg: "23%" }}
                  maxWidth={{ base: "520px", lg: "240px" }}
                  minH="400px"
                  flexShrink={0}
                >
                  <Box className="price-card-header" bg="#ffb3c1">
                    <Heading size="md" mb={4}>
                      알아두면 좋은 팁
                    </Heading>
                    <Box className="price-card-price">
                      <Flex justify="center" gap={2} flexWrap="wrap">
                        <Icon as={FaCheckCircle} boxSize={7} />
                      </Flex>
                    </Box>
                    <Text className="price-card-description">여행의 편의를 위한 정보</Text>
                  </Box>

                  <Box className="price-card-body" p={4}>
                    <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
                      {travelCourse.tips.map((tip, index) => {
                        // 점(.)을 모두 제거
                        const cleanedTip = tip.replace(/\./g, "");

                        // 팁 유형에 따라 아이콘 선택
                        let tipIcon = FaCheckCircle;
                        if (cleanedTip.includes("날씨")) {
                          tipIcon = FaCloudSun;
                        } else if (cleanedTip.includes("렌터카")) {
                          tipIcon = FaCar;
                        } else if (cleanedTip.includes("숙소") || cleanedTip.includes("예약")) {
                          tipIcon = FaHome;
                        } else if (cleanedTip.includes("음식")) {
                          tipIcon = FaUtensils;
                        } else if (cleanedTip.includes("입장료") || cleanedTip.includes("예산")) {
                          tipIcon = FaMoneyBill;
                        }

                        return (
                          <Flex
                            key={index}
                            bg="gray.50"
                            p={2}
                            borderRadius="md"
                            borderLeft="3px solid"
                            borderLeftColor="#ffb3c1"
                            alignItems="flex-start"
                          >
                            <Icon as={tipIcon} color="#ffb3c1" mt="2px" mr={2} boxSize={4} />
                            <Text fontSize="md" lineHeight="1.4">
                              {cleanedTip}
                            </Text>
                          </Flex>
                        );
                      })}
                    </SimpleGrid>
                  </Box>
                </Box>
              )}
            </Flex>

            {/* 추천 코스 목록으로 버튼 */}
            <Box textAlign="center" mt={10} mb={5} className="fade-in-up delay-5">
              <Link href="/#recommended-courses">
                <Button
                  bg="#F472B6" /* Airbnb Rausch Pink */
                  color="white"
                  size="lg"
                  px={8}
                  py={6}
                  fontWeight="600"
                  fontSize="md"
                  leftIcon={<FaChevronLeft />}
                  boxShadow="0 4px 14px rgba(255, 90, 95, 0.35)"
                  transition="all 0.3s ease"
                  border="none"
                  borderRadius="10px"
                  _hover={{
                    bg: "#FF7478" /* 살짝 밝은 핑크 */,
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 18px rgba(255, 90, 95, 0.45)",
                    border: "none",
                  }}
                  _active={{
                    bg: "#E04852",
                    transform: "translateY(0)",
                    boxShadow: "0 2px 6px rgba(255, 90, 95, 0.45)",
                    border: "none",
                  }}
                  h="auto"
                >
                  추천 코스 목록으로
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
