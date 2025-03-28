import { NextRequest, NextResponse } from 'next/server';
import { getImagesByKeyword, getDefaultImage } from '@/services/tourImageService';

// 이미지 API 서비스
export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터에서 location과 keyword 추출
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location') || '';
    const keyword = searchParams.get('keyword') || '';
    const tag = searchParams.get('tag') || '';
    
    console.log('이미지 API 호출:', { location, keyword, tag });
    
    // tourImageService를 사용하여 이미지 가져오기
    const images = await getImagesByKeyword(location, keyword, tag);
    
    // 결과 반환
    return NextResponse.json({ images });
  } catch (error) {
    console.error('이미지 처리 오류:', error);
    // 에러 발생 시 기본 이미지 반환
    const defaultLocation = typeof location === 'string' ? location : '';
    return NextResponse.json(
      { images: [getDefaultImage(defaultLocation || '기본')] },
      { status: 200 }
    );
  }
} 