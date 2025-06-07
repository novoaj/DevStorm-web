"use server"
import { cookies } from "next/headers";
import axios from 'axios';

// Your existing actions
export const fetchCSRFToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("csrf_refresh_token")?.value || "";
};

export const fetchCSRFAccess = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("csrf_access_token")?.value || "";
}

export const setToken = async (token : string) => {
    const cookieStore = await cookies();
    return cookieStore.set("csrf_access_token", token);
}

// New server actions for authentication checking
export const checkAuthCookies = async () => {
  const cookieStore = await cookies();
  const hasAccessToken = cookieStore.has('csrf_access_token');
  const hasRefreshToken = cookieStore.has('csrf_refresh_token');
  
  return hasAccessToken || hasRefreshToken;
}

export const getAuthStatus = async () => {
  try {
    const cookieStore = await cookies();
    const csrfAccessToken = cookieStore.get("csrf_access_token")?.value;
    const csrfRefreshToken = cookieStore.get("csrf_refresh_token")?.value;
    
    // If no tokens exist, user is definitely not logged in
    if (!csrfAccessToken && !csrfRefreshToken) {
      return { isLoggedIn: false, hasTokens: false };
    }
    
    // Try to verify with the access token first
    if (csrfAccessToken) {
      try {
        const response = await axios.post(
          `${process.env.FLASK_API_URL}/verify-token`,
          {},
          {
            headers: {
              'X-CSRF-TOKEN': csrfAccessToken,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 5000 // Add timeout to prevent hanging
          }
        );
        
        if (response.status === 200) {
          return { isLoggedIn: true, hasTokens: true };
        }
      } catch (error) {
        // Access token might be expired, continue to refresh token check
        console.log("Access token verification failed, trying refresh token");
      }
    }
    
    // If access token fails or doesn't exist, try refresh token
    if (csrfRefreshToken) {
      try {
        const refreshResponse = await axios.post(
          `${process.env.FLASK_API_URL}/token/refresh`,
          {},
          {
            headers: {
              'X-CSRF-TOKEN': csrfRefreshToken,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 5000
          }
        );
        
        if (refreshResponse.status === 200) {
          return { isLoggedIn: true, hasTokens: true };
        }
      } catch (refreshError) {
        console.log("Refresh token verification failed");
        return { isLoggedIn: false, hasTokens: true }; // Had tokens but they're invalid
      }
    }
    
    return { isLoggedIn: false, hasTokens: true }; // Had tokens but couldn't verify
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { isLoggedIn: false, hasTokens: false };
  }
}

// Lightweight version that just checks for cookie presence (faster)
export const hasAuthTokens = async () => {
  const cookieStore = await cookies();
  return {
    hasAccess: cookieStore.has('csrf_access_token'),
    hasRefresh: cookieStore.has('csrf_refresh_token'),
    hasAny: cookieStore.has('csrf_access_token') || cookieStore.has('csrf_refresh_token')
  };
}
