"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  useColorModeValue,
  Image,
  HStack,
  VStack,
  Icon,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { FaPlus, FaMapMarkedAlt, FaCalendarAlt, FaHeart, FaTrash } from 'react-icons/fa';
import Layout from '@/components/Layout';

export default function Dashboard() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const containerBg = useColorModeValue('white', 'gray.700');
  const emptyStateBg = useColorModeValue('white', 'gray.800');

  const { data: session, status } = useSession();
  const router = useRouter();
  const [travelPlans, setTravelPlans] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    // localStorage에서 여행 계획 데이터 가져오기
    if (typeof window !== 'undefined') {
      try {
        const savedPlans = localStorage.getItem('travelPlans');
        if (savedPlans) {
          setTravelPlans(JSON.parse(savedPlans));
        }
      } catch (error) {
        console.error('여행 계획 로드 중 오류 발생:', error);
      }
    }
  }, [status, router]);

  // 여행 계획 삭제 함수
  const deleteTravelPlan = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    
    if (confirm('이 여행 계획을 삭제하시겠습니까?')) {
      try {
        const savedPlans = localStorage.getItem('travelPlans');
        if (savedPlans) {
          const plans = JSON.parse(savedPlans);
          const filteredPlans = plans.filter((plan: any) => plan.id !== planId);
          localStorage.setItem('travelPlans', JSON.stringify(filteredPlans));
          setTravelPlans(filteredPlans);
        }
      } catch (error) {
        console.error('여행 계획 삭제 중 오류 발생:', error);
      }
    }
  };

  if (status === 'loading') {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Box 
          w="16px" h="16px" 
          borderRadius="full" 
          border="3px solid" 
          borderColor="blue.500" 
          borderTopColor="transparent"
          animation="spin 1s linear infinite"
        />
      </Flex>
    );
  }

  return (
    <Layout>
      <Box bg={containerBg} minH="100vh">
        <Container maxW="container.lg" py={8}>
          <Flex 
            direction="column" 
            align="center" 
            mb={10} 
            pt={4}
          >
            <Heading 
              size="xl" 
              mb={3} 
              color="gray.700" 
              fontWeight="bold"
            >
              나의 여행 계획
            </Heading>
            <Text 
              color="gray.500" 
              fontSize="md" 
              mb={6}
            >
              {session?.user?.email || '사용자'}님의 여행 계획
            </Text>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              size="md"
              onClick={() => router.push('/travel/create')}
              borderRadius="md"
              shadow="sm"
              _hover={{ bg: 'blue.600' }}
            >
              새 여행 계획 만들기
            </Button>
          </Flex>

          {travelPlans.length > 0 ? (
            <SimpleGrid 
              columns={{ base: 1, sm: 2, lg: 3 }} 
              spacing={4}
              mx="auto"
              maxW="1000px"
            >
              {travelPlans.map((plan: any) => (
                <Card 
                  key={plan.id} 
                  bg={cardBg}
                  shadow="md"
                  borderRadius="lg"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => router.push(`/travel/${plan.id}`)}
                  transition="all 0.3s ease"
                  maxW="320px"
                  mx="auto"
                  _hover={{ 
                    transform: 'translateY(-4px)', 
                    shadow: 'lg',
                  }}
                >
                  <Box position="relative">
                    <Image
                      src={plan.image || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3"}
                      alt={plan.destination}
                      objectFit="cover"
                      height="200px"
                      width="100%"
                    />
                    <Box 
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)"
                    />
                    <Box
                      position="absolute"
                      bottom={4}
                      left={4}
                      right={4}
                    >
                      <Badge 
                        bg="blue.500" 
                        color="white" 
                        px={2} 
                        py={1} 
                        borderRadius="full"
                        mb={2}
                        fontSize="xs"
                      >
                        {plan.travelStyle}
                      </Badge>
                      <Text 
                        color="white" 
                        fontWeight="bold" 
                        fontSize="2xl" 
                        textShadow="0 2px 4px rgba(0,0,0,0.3)"
                      >
                        {plan.destination || '여행지'}
                      </Text>
                    </Box>
                  </Box>
                  
                  <CardBody p={5}>
                    <VStack spacing={4} align="stretch">
                      <HStack color="gray.600" fontSize="sm" spacing={4}>
                        <HStack spacing={2}>
                          <Icon as={FaCalendarAlt} color="blue.500" />
                          <Text fontWeight="medium">
                            {new Date(plan.startDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} - {new Date(plan.endDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                          </Text>
                        </HStack>
                      </HStack>

                      <Divider />
                      
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" mb={3} color="gray.700">
                          여행 콘셉트
                        </Text>
                        <Flex gap={2} flexWrap="wrap">
                          {(() => {
                            const firstDay = Object.values(plan.recommendations?.schedule || {})[0] as { spots?: any[] } | undefined;
                            const spots = firstDay?.spots || [];
                            
                            return spots.length > 0 
                              ? spots.slice(0, 3).map((spot: any, idx: number) => (
                                  <Badge 
                                    key={idx} 
                                    colorScheme="green" 
                                    variant="subtle" 
                                    fontSize="xs"
                                    borderRadius="full"
                                    px={3}
                                  >
                                    {spot?.category_name?.split(' > ').pop() || '관광지'}
                                  </Badge>
                                ))
                              : ['힐링', '관광', '먹방'].map((tag) => (
                                  <Badge 
                                    key={tag} 
                                    colorScheme="green" 
                                    variant="subtle" 
                                    fontSize="xs"
                                    borderRadius="full"
                                    px={3}
                                  >
                                    {tag}
                                  </Badge>
                                ));
                          })()}
                        </Flex>
                      </Box>
                      
                      <Flex justify="space-between" align="center" mt={2}>
                        {plan.recommendations && (
                          <Badge 
                            colorScheme="purple" 
                            variant="subtle" 
                            fontSize="xs"
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            AI 추천
                          </Badge>
                        )}
                        <HStack spacing={4}>
                          <Icon 
                            as={FaHeart} 
                            color="red.400" 
                            cursor="pointer" 
                            transition="all 0.2s"
                            _hover={{ color: 'red.500', transform: 'scale(1.1)' }} 
                          />
                          <Icon 
                            as={FaTrash} 
                            color="gray.400" 
                            cursor="pointer" 
                            transition="all 0.2s"
                            _hover={{ color: 'red.500', transform: 'scale(1.1)' }} 
                            onClick={(e) => deleteTravelPlan(e, plan.id)}
                          />
                        </HStack>
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Box 
              textAlign="center" 
              py={16}
              maxW="md" 
              mx="auto" 
              bg={emptyStateBg}
              borderRadius="lg" 
              shadow="sm"
              border="1px" 
              borderColor="gray.100"
            >
              <Icon as={FaMapMarkedAlt} boxSize={12} color="blue.100" mb={4} />
              <Heading size="md" color="gray.700" mb={3}>
                아직 여행 계획이 없어요
              </Heading>
              <Text color="gray.500" fontSize="sm" mb={8}>
                새로운 여행 계획을 만들어보세요!
              </Text>
              <Button
                leftIcon={<FaPlus />}
                colorScheme="blue"
                onClick={() => router.push('/travel/create')}
                size="md"
              >
                여행 계획 만들기
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </Layout>
  );
}