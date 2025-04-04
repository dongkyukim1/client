// 도시별 이미지 매핑 (단일 이미지)
const cityImages: Record<string, string> = {
  '서울': '/images/seoul.jpg',
  '경주': '/images/gyeongju.jpg',
  '강원': '/images/gangwon.jpg',
  '전주': '/images/jeonju.jpg',
  '통영': '/images/tongyeong.jpg',
  '여수': '/images/yeosu.jpg',
  '제주도': '/images/jeju.png',
  '강원도': '/images/kangwon.png',
};

// 여러 이미지가 있는 도시 매핑
const multipleImages: Record<string, string[]> = {
  '부산': [
    '/images/busan.png', 
    '/images/locations/busan/busan1.jpg', 
    '/images/locations/busan/busan2.jpg'
  ],
  '제주': [
    '/images/jeju.png',
    '/images/jeju-course.png'
  ]
};

// 도시 이름에 따라 이미지 URL을 반환하는 함수
export const getCityImage = (destination: string): string => {
  if (!destination) return "/images/hero-bg.png";
  
  // 도시 이름이 정확히 일치하는 경우 (여러 이미지 중 랜덤)
  if (multipleImages[destination]) {
    const images = multipleImages[destination];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }
  
  // 도시 이름이 정확히 일치하는 경우 (단일 이미지)
  if (cityImages[destination]) {
    return cityImages[destination];
  }

  // 도시 이름이 포함된 경우 (여러 이미지 중 랜덤)
  for (const [city, images] of Object.entries(multipleImages)) {
    if (destination.toLowerCase().includes(city.toLowerCase())) {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }
  }

  // 도시 이름이 포함된 경우 (단일 이미지)
  for (const [city, image] of Object.entries(cityImages)) {
    if (destination.toLowerCase().includes(city.toLowerCase())) {
      return image;
    }
  }

  // 기본 이미지 반환
  return "/images/hero-bg.png";
}; 