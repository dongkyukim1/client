'use client'

import { Box, Container, Heading, Image, Text, Spinner, Center } from '@chakra-ui/react'
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import Link from 'next/link'
import Button from '@/components/common/Button'
import { useState, useEffect } from 'react'

// API 응답 타입 정의
interface Course {
  courseId: number
  contentId: string
  thumbnailUrl: string
  title: string
  area: string
  likeCount: number
  rating?: number
}

export default function RecommendedCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/course', {
          mode: 'cors',
          cache: 'no-store',
        })
        
        const data = await response.json()
        console.log('API 응답 데이터:', data)
        
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data.slice(0, 8))
        } else {
          console.warn('데이터가 비어있거나 배열이 아닙니다:', data)
          setCourses([])
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('API 요청 오류:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (isLoading) {
    return (
      <Box as="section" className="section" id="recommended-courses">
        <Container className="section-container">
          <Heading as="h2" className="section-title">
            추천 인기 여행 코스
          </Heading>
          <Center my={10}>
            <Spinner size="xl" />
          </Center>
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Box as="section" className="section" id="recommended-courses">
        <Container className="section-container">
          <Heading as="h2" className="section-title">
            추천 인기 여행 코스
          </Heading>
          <Center my={10}>
            <Text color="red.500">{error}</Text>
          </Center>
        </Container>
      </Box>
    )
  }

  return (
    <Box as="section" className="section" id="recommended-courses">
      <Container className="section-container">
        <Heading as="h2" className="section-title">
          추천 인기 여행 코스
        </Heading>
        
        <Box textAlign="center" mt={4} mb={6}>
          <Link href="/popular-courses" passHref legacyBehavior>
            <Button 
              variant="primary" 
              size="lg"
              className="ml-2 hover:bg-pink-600"
            >
              더 많은 코스 보기
            </Button>
          </Link>
        </Box>
        
        <Box className="festival-grid">
          {courses.map((course) => (
            <Link key={course.courseId} href={`/travel/popular/${course.courseId}`} style={{ textDecoration: 'none' }}>
              <Box className="festival-card" cursor="pointer" _hover={{ transform: 'translateY(-5px)', transition: 'transform 0.3s ease' }}>
                <Box className="festival-image">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                  />
                </Box>
                <Box className="festival-content">
                  <Text className="festival-title">
                    {course.title}
                  </Text>
                  <Box className="festival-date" display="flex" alignItems="center">
                    <Box as={FaClock} mr={2} />
                    <Text>{course.rating ? `평점: ${course.rating}` : '새로운 코스'}</Text>
                  </Box>
                  <Box className="festival-location" display="flex" alignItems="center">
                    <Box as={FaMapMarkerAlt} className="festival-location-icon" />
                    <Text>{course.area}</Text>
                  </Box>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

// 기존 이름과의 호환성을 위한 별칭
export { RecommendedCoursesSection as FestivalSection } 