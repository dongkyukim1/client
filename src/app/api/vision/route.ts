import { NextResponse } from 'next/server';

// 지역 인식을 위한 패턴 정의
const LOCATION_PATTERNS = {
  CITIES: /(서울|부산|대구|인천|광주|대전|울산|세종|고양|수원|안양|성남|용인|부천|안산|화성|파주|김포)/i,
  DISTRICTS: /(강남구|서초구|종로구|마포구|송파구|용산구|영등포구|일산동구|일산서구|분당구|덕양구)/i,
  PROVINCES: /(경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주도)/i,
  DETAIL_AREAS: /(일산|분당|판교|동탄|송도|정자동|대화동|백석동|덕이동|청계동)/i
};

async function callGoogleVisionAPI(base64Image: string) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google API 키가 설정되지 않았습니다.');
    }

    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 10
            }
          ],
          imageContext: {
            languageHints: ['ko']
          }
        }
      ]
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Vision API 에러 응답:', errorData);
      throw new Error(`Vision API error: ${response.status} - ${errorData.error?.message || '알 수 없는 오류'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Google Vision API 호출 오류:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: '이미지 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // Base64 이미지 데이터 검증
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: '올바른 이미지 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // Base64 인코딩된 이미지 데이터 처리
    const base64Image = image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '');
    
    // Base64 데이터 길이 검증 (대략적인 이미지 크기 체크)
    const imageSize = Math.ceil((base64Image.length * 3) / 4);
    if (imageSize > 4 * 1024 * 1024) { // 4MB 제한
      return NextResponse.json(
        { error: '이미지 크기가 너무 큽니다. 4MB 이하의 이미지를 사용해주세요.' },
        { status: 400 }
      );
    }

    // Google Vision API 호출
    const visionResponse = await callGoogleVisionAPI(base64Image);
    
    if (!visionResponse.responses || !visionResponse.responses[0]) {
      return NextResponse.json(
        { error: '이미지 분석에 실패했습니다.' },
        { status: 500 }
      );
    }

    const textAnnotations = visionResponse.responses[0].textAnnotations;
    if (!textAnnotations || textAnnotations.length === 0) {
      return NextResponse.json(
        { error: '이미지에서 텍스트를 찾을 수 없습니다.' },
        { status: 400 }
      );
    }

    // 전체 텍스트 추출
    const extractedText = textAnnotations[0].description;

    return NextResponse.json({
      text: extractedText,
      mainLocation: '',
      locationOptions: [],
      allLocations: {
        cities: [],
        districts: [],
        provinces: [],
        detailAreas: []
      }
    });
  } catch (error) {
    console.error('Vision API 처리 오류:', error);
    return NextResponse.json(
      { 
        error: '이미지 분석 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

// 텍스트에서 지역 정보 추출 함수
function extractLocationInfo(text: string) {
  const locations: { [key: string]: string[] } = {
    cities: [],
    districts: [],
    provinces: [],
    detailAreas: [],
  };
  
  // 도/광역시 검색
  const provinceMatches = text.match(new RegExp(LOCATION_PATTERNS.PROVINCES, 'g'));
  if (provinceMatches) {
    locations.provinces = provinceMatches.map(m => m.toLowerCase());
  }
  
  // 시/군 검색
  const cityMatches = text.match(new RegExp(LOCATION_PATTERNS.CITIES, 'g'));
  if (cityMatches) {
    locations.cities = cityMatches.map(m => m.toLowerCase());
  }
  
  // 구/동 검색
  const districtMatches = text.match(new RegExp(LOCATION_PATTERNS.DISTRICTS, 'g'));
  if (districtMatches) {
    locations.districts = districtMatches.map(m => m.toLowerCase());
  }
  
  // 상세 지역 검색
  const areaMatches = text.match(new RegExp(LOCATION_PATTERNS.DETAIL_AREAS, 'g'));
  if (areaMatches) {
    locations.detailAreas = areaMatches.map(m => m.toLowerCase());
  }
  
  return locations;
} 