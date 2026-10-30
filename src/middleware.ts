import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabaseMiddleware';

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAdmin = user?.app_metadata?.role === 'admin';

  if (isLoginPage && user && isAdmin) {
    const redirectResponse = NextResponse.redirect(new URL('/admin', request.url));
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  if (!isLoginPage && (!user || !isAdmin)) {
    const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
