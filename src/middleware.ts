import { type NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('refreshToken')

  // 로그인이 필요한 페이지
  const protectedRoutes = ["/info", "/travel/create"];

  // 단일 travel ID 페이지는 공개 접근 허용 (/travel/[id])
  const isPublicTravelPage = /^\/travel\/[^/]+$/.test(pathname);

  if (!token && protectedRoutes.some(route => pathname.startsWith(route)) && !isPublicTravelPage)
    return NextResponse.redirect(new URL("/login", req.url));


  // 로그인 되어 있을 때, 로그인 페이지로 접근 할 경우 홈페이지로 리다이렉트
  if (token && pathname.startsWith("/login"))
    return NextResponse.redirect(new URL("/", req.url));

  return NextResponse.next();
}

// 아래 경로만 미들웨어 동작
export const config = {
  matcher: ["/login", "/travel/:path*"],
};