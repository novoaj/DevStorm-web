"use server"
import { cookies } from "next/headers";
import axios from 'axios';

// Your existing actions
export const fetchCSRFToken = async () => {
    const cookieStore = cookies();
    return cookieStore.get("csrf_refresh_token")?.value || "";
};

export const fetchCSRFAccess = async () => {
  const cookieStore = cookies();
  return cookieStore.get("csrf_access_token")?.value || "";
}

export const setToken = async (token : string) => {
    const cookieStore = cookies();
    return cookieStore.set("csrf_access_token", token);
}

// New server actions for authentication checking
export const checkAuthCookies = async () => {
  const cookieStore = cookies();
  const hasAccessToken = cookieStore.has('csrf_access_token');
  const hasRefreshToken = cookieStore.has('csrf_refresh_token');
  
  return hasAccessToken || hasRefreshToken;
}

export const getAuthStatus = async () => {
  try {
    const cookieStore = cookies();
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
          `${process.env.NEXT_PUBLIC_API_URL}/verify-token`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/token/refresh`,
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
  const cookieStore = cookies();
  return {
    hasAccess: cookieStore.has('csrf_access_token'),
    hasRefresh: cookieStore.has('csrf_refresh_token'),
    hasAny: cookieStore.has('csrf_access_token') || cookieStore.has('csrf_refresh_token')
  };
}

// Add this server-side fetch function that matches your axiosInstance pattern
export const serverFetchWithRefresh = async (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data: any = undefined) => {
  const cookieStore = cookies();
  
  // Get both CSRF tokens and the actual cookies
  const csrfAccessToken = cookieStore.get("csrf_access_token")?.value;
  const csrfRefreshToken = cookieStore.get("csrf_refresh_token")?.value;
  
  // Also get the actual cookie values that Flask expects
  const accessTokenCookie = cookieStore.get("access_token_cookie")?.value;
  const refreshTokenCookie = cookieStore.get("refresh_token_cookie")?.value;
  
  // Helper function to make request with both CSRF headers and cookies
  const makeRequest = async (csrfToken: string, includeRefreshCookie: boolean = false) => {
    // Build cookie string manually
    let cookieString = '';
    
    if (accessTokenCookie) {
      cookieString += `access_token_cookie=${accessTokenCookie}; `;
    }
    
    if (includeRefreshCookie && refreshTokenCookie) {
      cookieString += `refresh_token_cookie=${refreshTokenCookie}; `;
    }
    
    // Remove trailing '; '
    cookieString = cookieString.slice(0, -2);
    
    const config = {
      method,
      url,
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        ...(cookieString && { 'Cookie': cookieString })
      },
      timeout: 5000,
      ...(data && { data })
    };

    return await axios(config);
  };

  // Try with access token first
  if (csrfAccessToken && accessTokenCookie) {
    try {
      return await makeRequest(csrfAccessToken);
    } catch (error) {
      console.log(`Access token failed for ${url}, trying refresh...`);
      
      // If 401 and we have refresh token, try to refresh
      if (error.response?.status === 401 && csrfRefreshToken && refreshTokenCookie) {
        try {
          // Refresh the token
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/token/refresh`, 
            {},
            {
              headers: {
                'X-CSRF-TOKEN': csrfRefreshToken,
                'Content-Type': 'application/json',
                'Cookie': `refresh_token_cookie=${refreshTokenCookie}`
              },
              timeout: 5000
            }
          );
          
          if (refreshResponse.status === 200) {
            // After refresh, check for new cookies
            const newAccessToken = cookieStore.get("csrf_access_token")?.value;
            const newAccessCookie = cookieStore.get("access_token_cookie")?.value;
            
            if (newAccessToken && newAccessCookie) {
              console.log(`Token refreshed, retrying ${url}...`);
              return await makeRequest(newAccessToken);
            } else {
              throw new Error('No new access token after refresh');
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Authentication failed - token refresh unsuccessful');
        }
      }
      
      throw error;
    }
  }
  
  throw new Error('No valid authentication tokens available');
};