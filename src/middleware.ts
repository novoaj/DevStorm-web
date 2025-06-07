import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = [
  '/profile',
  '/profile/edit', 
  '/create-project',
  '/project',
  '/dashboard'
];

// Paths for authentication (redirect if already logged in)
const authPaths = [
  '/auth/login',
  '/auth/register'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user has authentication cookies
  const accessToken = request.cookies.get('csrf_access_token');
  const refreshToken = request.cookies.get('csrf_refresh_token');
  const hasAuthCookies = !!accessToken || !!refreshToken;
  
  // console.log(`Middleware: ${pathname}, hasAuthCookies: ${hasAuthCookies}`);
  
  // Protect routes that require authentication
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!hasAuthCookies) {
      console.log(`Redirecting ${pathname} to login - no auth cookies`);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  // Redirect authenticated users away from auth pages
  if (authPaths.some(path => pathname === path)) {
    if (hasAuthCookies) {
      console.log(`Redirecting ${pathname} to profile - user already authenticated`);
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Protected paths
    '/profile/:path*',
    '/create-project/:path*', 
    '/project/:path*',
    '/dashboard/:path*',
    // Auth paths
    '/auth/login',
    '/auth/register'
  ]
};