import { NextRequest, NextResponse } from 'next/server';

/**
 * 기상청 단기예보 API 프록시 라우트
 * CORS 우회 및 API 키 보호를 위한 서버 측 프록시
 */
export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터 가져오기
    const searchParams = request.nextUrl.searchParams;
    const serviceKey = searchParams.get('serviceKey');
    const baseDate = searchParams.get('base_date');
    const baseTime = searchParams.get('base_time');
    const nx = searchParams.get('nx');
    const ny = searchParams.get('ny');
    
    // 필수 파라미터 확인
    if (!serviceKey || !baseDate || !baseTime || !nx || !ny) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 기상청 API 호출을 위한 URL 구성
    const apiUrl = new URL('https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst');
    
    // API 파라미터 설정
    apiUrl.searchParams.append('serviceKey', serviceKey);
    apiUrl.searchParams.append('pageNo', '1');
    apiUrl.searchParams.append('numOfRows', '1000'); // 충분한 데이터 가져오기
    apiUrl.searchParams.append('dataType', 'JSON');
    apiUrl.searchParams.append('base_date', baseDate);
    apiUrl.searchParams.append('base_time', baseTime);
    apiUrl.searchParams.append('nx', nx);
    apiUrl.searchParams.append('ny', ny);
    
    console.log(`기상청 API 요청: ${apiUrl.toString()}`);
    console.log(`지역 격자 좌표: nx=${nx}, ny=${ny}`);
    
    // API 호출
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
    });
    
    if (!response.ok) {
      console.error(`기상청 API 오류: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `기상청 API 오류: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // 응답 데이터 파싱
    const data = await response.json();
    
    // 응답 코드 확인
    if (data.response?.header?.resultCode !== '00') {
      console.error(`기상청 API 오류 코드: ${data.response?.header?.resultCode}, 메시지: ${data.response?.header?.resultMsg}`);
      return NextResponse.json(
        { 
          error: '기상청 API 오류', 
          code: data.response?.header?.resultCode, 
          message: data.response?.header?.resultMsg 
        },
        { status: 500 }
      );
    }

    // 응답 데이터 샘플 로깅 (디버깅 목적)
    if (data.response?.body?.items?.item && data.response.body.items.item.length > 0) {
      const sampleItems = data.response.body.items.item.slice(0, 5);
      console.log(`기상청 API 응답 샘플 (첫 5개 항목):`, JSON.stringify(sampleItems, null, 2));
      
      // 현재 시간에 가장 가까운 예보 찾기
      const now = new Date();
      const currentHour = now.getHours();
      const currentDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      
      // 온도(TMP) 항목 중에서 현재 시간에 가장 가까운 항목 찾기
      const tempItems = data.response.body.items.item.filter(item => item.category === 'TMP');
      const skyItems = data.response.body.items.item.filter(item => item.category === 'SKY');
      const popItems = data.response.body.items.item.filter(item => item.category === 'POP'); // 강수확률
      
      if (tempItems.length > 0 && skyItems.length > 0 && popItems.length > 0) {
        console.log(`현재 날짜: ${currentDate}, 현재 시간: ${currentHour}시`);
        console.log(`온도 데이터 개수: ${tempItems.length}`);
        console.log(`하늘상태 데이터 개수: ${skyItems.length}`);
        console.log(`강수확률 데이터 개수: ${popItems.length}`);
        
        // 첫 번째 예보 시간 로깅
        console.log(`첫 번째 예보 - 날짜: ${tempItems[0].fcstDate}, 시간: ${tempItems[0].fcstTime}`);
      }
    }
    
    // 성공 응답 반환
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('날씨 API 프록시 오류:', error);
    return NextResponse.json(
      { error: '서버 내부 오류' },
      { status: 500 }
    );
  }
} 