'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Flex, 
  Image, 
  HStack, 
  Icon, 
  useToast,
  useColorModeValue,
  Spinner,
  Center
} from '@chakra-ui/react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { BsArrowUpRight } from 'react-icons/bs'
import Link from 'next/link'
import NavSection from '@/components/common/NavSection'
import Footer from '@/components/common/Footer'
import { useSession } from 'next-auth/react'

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

export default function PopularCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [likedCourses, setLikedCourses] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()
  const { data: session } = useSession()

  // 색상 변수
  const bgColor = useColorModeValue('white', 'gray.800')
  const cardBg = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('black', 'white')
  const borderColor = useColorModeValue('black', 'cyan.400')
  const shadowColor = useColorModeValue('black', 'cyan')

  // 코스 데이터 가져오기
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/course')
        
        if (!response.ok) {
          throw new Error('코스 데이터를 불러오는 중 오류가 발생했습니다')
        }
        
        const data = await response.json()
        setCourses(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // 찜 목록 불러오기
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedCourses')
    if (savedLikes) {
      setLikedCourses(JSON.parse(savedLikes))
    }
  }, [])

  // 찜하기 토글
  const toggleLike = (courseId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session) {
      toast({
        title: '로그인이 필요합니다',
        description: '찜하기는 로그인 후 이용할 수 있습니다',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    let newLikedCourses
    if (likedCourses.includes(courseId)) {
      newLikedCourses = likedCourses.filter(id => id !== courseId)
      toast({
        title: '찜 목록에서 제거되었습니다',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    } else {
      newLikedCourses = [...likedCourses, courseId]
      toast({
        title: '찜 목록에 추가되었습니다',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }
    
    setLikedCourses(newLikedCourses)
    localStorage.setItem('likedCourses', JSON.stringify(newLikedCourses))
  }

  if (isLoading) {
    return (
      <>
        <NavSection />
        <Box bg={bgColor} pt="100px" pb="50px" minH="100vh">
          <Container maxW="container.xl">
            <Center my={10}>
              <Spinner size="xl" />
            </Center>
          </Container>
        </Box>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <NavSection />
        <Box bg={bgColor} pt="100px" pb="50px" minH="100vh">
          <Container maxW="container.xl">
            <Center my={10}>
              <Text color="red.500">{error}</Text>
            </Center>
          </Container>
        </Box>
        <Footer />
      </>
    )
  }

  return (
    <>
      <NavSection />
      
      {/* 메인 콘텐츠 영역 - 상단에 넉넉한 여백 */}
      <Box bg={bgColor} pt="100px" pb="50px" minH="100vh">
        <Container maxW="container.xl" px={0}>
          {/* 제목 */}
          <Flex 
            justifyContent="space-between" 
            alignItems="center" 
            mb="40px"
            width="100%"
            pl={{ base: 0, md: 0 }}
          >
            <Heading 
              as="h1" 
              fontSize="2xl" 
              color={textColor}
              textAlign={{ base: "center", md: "left" }}
              ml={{ base: 4, md: "30%", lg: "35%" }}
            >
              추천 인기 여행 코스
            </Heading>
            
            <Link 
              href="/travel/popular/all" 
            >
              <Box
                ml={{ base: 2, md: 4 }}
                mr={{ base: 4, md: "5%" }}
              >
                <Flex
                  alignItems="center"
                  borderBottom="1px solid"
                  borderColor={borderColor}
                  _hover={{ color: "blue.500", borderColor: "blue.500" }}
                  pb={1}
                >
                  <Text fontSize="sm" fontWeight="medium" mr={1}>더보기</Text>
                  <Icon as={BsArrowUpRight} boxSize={3} />
                </Flex>
              </Box>
            </Link>
          </Flex>

          {/* 여행 코스 카드 그리드 - 정사각형 카드로 가로 배열 */}
          <Flex 
            overflowX="visible"
            overflowY="visible"
            pb={6}
            width="100%"
            maxW="100%"
            flexWrap="wrap"
            gap="28px"
            pl="200px"
            pr="20px"
          >
            {courses.map(course => (
              <Box 
                key={course.courseId}
                position="relative"
                border="1px solid"
                borderColor={borderColor}
                borderRadius="sm"
                bg={cardBg}
                boxShadow={`4px 4px 0 ${shadowColor}`}
                display="flex"
                flexDirection="column"
                overflow="hidden"
                flex="0 0 235px"
                minW="235px"
                h="354px"
                mb={4}
                transition="all 0.3s ease-in-out"
                _hover={{
                  transform: "rotate(3deg)",
                  boxShadow: `6px 6px 0 ${shadowColor}`,
                  zIndex: 1,
                  cursor: "pointer"
                }}
              >
                {/* 이미지 영역 - 비율 조정 */}
                <Box position="relative" height="52%" overflow="hidden">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                  {/* 지역 뱃지 - 이미지 위에 배치 */}
                  <Box
                    position="absolute"
                    top="12px"
                    left="12px"
                    bg={borderColor}
                    color="white"
                    fontSize="0.8rem"
                    fontWeight="semibold"
                    px={2.5}
                    py={1}
                    borderRadius="sm"
                    letterSpacing="0.5px"
                  >
                    {course.area.split(' ')[0]?.toUpperCase() || course.area}
                  </Box>
                </Box>

                {/* 콘텐츠 영역 - 비율 조정 */}
                <Flex 
                  direction="column" 
                  height="48%" 
                  p={5} 
                  justify="space-between"
                >
                  <Box 
                    display="flex" 
                    flexDirection="column" 
                    justifyContent="center" 
                    alignItems="center"
                    flex="1"
                    my="auto"
                  >
                    {/* 제목 */}
                    <Heading
                      as="h3"
                      fontSize="1.05rem"
                      fontWeight="bold"
                      mb={2.5}
                      noOfLines={1}
                      color={textColor}
                      letterSpacing="-0.3px"
                      textAlign="center"
                      width="100%"
                    >
                      {course.title}
                    </Heading>

                    {/* 간단 소개 - 지역과 좋아요 수 표시 */}
                    <Text 
                      fontSize="0.85rem" 
                      color={textColor} 
                      opacity={0.85}
                      noOfLines={1} 
                      lineHeight="1.6"
                      letterSpacing="-0.2px"
                      textAlign="center"
                      width="100%"
                      mb={1}
                    >
                      {course.area}
                    </Text>
                    <Text 
                      fontSize="0.85rem" 
                      color={textColor} 
                      opacity={0.85}
                      noOfLines={1} 
                      lineHeight="1.6"
                      letterSpacing="-0.2px"
                      textAlign="center"
                      width="100%"
                    >
                      좋아요: {course.likeCount}
                    </Text>
                  </Box>

                  {/* 하단 액션 영역 */}
                  <HStack 
                    borderTop="1px solid" 
                    borderColor={borderColor} 
                    spacing={0} 
                    mt={4}
                  >
                    <Link href={`/travel/popular/${course.courseId}`} style={{ flexGrow: 1 }}>
                      <Flex
                        p={2.5}
                        alignItems="center"
                        justifyContent="space-between"
                        cursor="pointer"
                        _hover={{ bg: 'gray.100' }}
                      >
                        <Text 
                          fontSize="0.85rem" 
                          fontWeight="semibold" 
                          color={textColor}
                          letterSpacing="-0.2px"
                        >
                          자세히 보기
                        </Text>
                        <Icon as={BsArrowUpRight} color={textColor} boxSize={3} />
                      </Flex>
                    </Link>
                    
                    <Flex
                      p={2.5}
                      alignItems="center"
                      justifyContent="center"
                      borderLeft="1px solid"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={(e) => toggleLike(course.courseId, e)}
                      _hover={{ bg: 'gray.100' }}
                      w="42px"
                    >
                      <Icon 
                        as={likedCourses.includes(course.courseId) ? FaHeart : FaRegHeart} 
                        color={likedCourses.includes(course.courseId) ? "red.500" : "gray.500"} 
                        fontSize="1rem"
                      />
                    </Flex>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Container>
      </Box>
      
      <Footer />
    </>
  )
} 