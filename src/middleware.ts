import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // 로그인이 필요한 페이지
    const protectedRoutes = ["/dashboard", "/travel"];

    if (!token && protectedRoutes.some(route => pathname.startsWith(route)))
        return NextResponse.redirect(new URL("/login", req.url));


    if (token && pathname.startsWith("/login"))
        return NextResponse.redirect(new URL("/dashboard", req.url));

    return NextResponse.next();
}

// 아래 경로만 미들웨어 동작
export const config = {
    matcher: ["/login", '/dashboard', "/travel/:path*"],
};