import { Review } from '@/types/review';

export const mockReviews: Review[] = [
  {
    id: '1',
    title: '제주도의 숨겨진 해변',
    content: '제주도 서쪽에 위치한 이 해변은 관광객들에게 잘 알려지지 않은 곳입니다...',
    location: '제주도',
    images: [
      '/images/locations/jeju/jeju1.jpg',
      '/images/locations/jeju/jeju2.jpg',
      '/images/locations/jeju/jeju3.jpg'
    ],
    rating: 4.8,
    author: {
      id: 'user1',
      name: '여행자',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    tags: ['해변', '일몰', '제주도', '힐링'],
    createdAt: '2023-06-15T09:30:00Z',
    updatedAt: '2023-06-15T09:30:00Z'
  },
  {
    id: '2',
    title: '서울 골목길 맛집 탐방',
    content: '서울 연남동의 숨겨진 골목길을 따라 다양한 맛집을 탐방했습니다...',
    location: '서울 연남동',
    images: [
      '/images/locations/seoul/seoul1.jpg',
      '/images/locations/seoul/seoul2.jpg'
    ],
    rating: 4.5,
    author: {
      id: 'user2',
      name: '맛집탐험가',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    tags: ['맛집', '서울', '연남동', '파스타'],
    createdAt: '2023-07-22T14:15:00Z',
    updatedAt: '2023-07-23T10:20:00Z'
  },
  {
    id: '3',
    title: '부산 해운대 일출 명소',
    content: '부산 해운대에서 바라본 일출은 정말 환상적입니다...',
    location: '부산 해운대',
    images: [
      '/images/locations/busan/busan1.jpg',
      '/images/locations/busan/busan2.jpg'
    ],
    rating: 4.9,
    author: {
      id: 'user3',
      name: '새벽여행자',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    tags: ['부산', '해운대', '일출', '동백섬'],
    createdAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-10T08:45:00Z'
  },
  {
    id: '4',
    title: '경주 역사 탐방 코스',
    content: '경주는 정말 볼거리가 많은 도시입니다...',
    location: '경주',
    images: [
      '/images/locations/gyeongju/gyeongju1.jpg',
      '/images/locations/gyeongju/gyeongju2.jpg'
    ],
    rating: 4.7,
    author: {
      id: 'user4',
      name: '역사탐험가',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    tags: ['경주', '역사', '불국사', '안압지'],
    createdAt: '2023-09-05T11:20:00Z',
    updatedAt: '2023-09-06T09:15:00Z'
  },
  {
    id: '5',
    title: '전주 한옥마을 당일치기',
    content: '전주 한옥마을은 당일치기로 다녀오기 좋은 여행지입니다...',
    location: '전주',
    images: [
      '/images/locations/jeonju/jeonju1.jpg',
      '/images/locations/jeonju/jeonju2.jpg'
    ],
    rating: 4.4,
    author: {
      id: 'user5',
      name: '당일치기여행러',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    tags: ['전주', '한옥마을', '비빔밥', '당일치기'],
    createdAt: '2023-10-18T16:40:00Z',
    updatedAt: '2023-10-18T16:40:00Z'
  },
  {
    id: '6',
    title: '강원도 양양 서핑 체험',
    content: '강원도 양양은 한국의 서핑 메카로 불리는 곳입니다...',
    location: '강원도 양양',
    images: [
      '/images/locations/gangwon/gangwon1.jpg',
      '/images/locations/gangwon/gangwon2.jpg',
      '/images/locations/gangwon/gangwon3.jpg'
    ],
    rating: 4.6,
    author: {
      id: 'user6',
      name: '서핑러버',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    tags: ['양양', '서핑', '강원도', '액티비티'],
    createdAt: '2023-08-03T10:30:00Z',
    updatedAt: '2023-08-04T09:20:00Z'
  }
];
