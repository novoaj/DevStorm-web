import { NextResponse } from 'next/server';
import { checkAuthCookies, getAuthStatus } from '../../../actions/actions';

export async function GET() {
  try {
    // Quick cookie check first
    const hasCookies = await checkAuthCookies();
    
    if (!hasCookies) {
      return NextResponse.json({ isLoggedIn: false, hasTokens: false });
    }
    
    // Full auth verification
    const authStatus = await getAuthStatus();
    return NextResponse.json(authStatus);
  } catch (error) {
    console.error('Auth status check failed:', error);
    return NextResponse.json({ isLoggedIn: false, hasTokens: false }, { status: 500 });
  }
}