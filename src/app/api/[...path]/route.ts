import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
    const path = req.nextUrl.pathname.replace("/api", "");
    const cookieStore = await cookies();
    
    const isAuthEndpoint = path === '/login' || path === '/register' || path === '/confirm';
    
    const accessToken = cookieStore.get("access_token_cookie")?.value;
    const csrfAccessToken = cookieStore.get("csrf_access_token")?.value;

    let bodyContent = null;
    if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
            const body = await req.json();
            bodyContent = JSON.stringify(body);
        } catch (error) {
            try {
                // Clone the request to avoid "body already consumed" error
                const clonedReq = req.clone();
                bodyContent = await clonedReq.text();
            } catch (e) {
                console.warn("Could not parse request body:", e);
                bodyContent = null; // Explicitly set to null for safety
            }
        }
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Only add auth headers for non-auth endpoints
    if (!isAuthEndpoint) {
        headers.Cookie = `access_token_cookie=${accessToken}`;
        headers["X-CSRF-TOKEN"] = csrfAccessToken || "";
    }

    const apiRes = await fetch(`${process.env.FLASK_API_URL}${path}`, {
        method: req.method,
        headers,
        body: bodyContent, // This will be null for GET/DELETE requests
    });

    if (apiRes.status === 401 && !isAuthEndpoint) {
        const refreshToken = cookieStore.get("refresh_token_cookie")?.value;
        const csrfRefreshToken = cookieStore.get("csrf_refresh_token")?.value;

        if (!refreshToken || !csrfRefreshToken) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        const refreshRes = await fetch(
            `${process.env.FLASK_API_URL}/token/refresh`,
            {
                method: "POST",
                headers: {
                    Cookie: `refresh_token_cookie=${refreshToken}`,
                    "X-CSRF-TOKEN": csrfRefreshToken,
                },
            },
        );

        if (!refreshRes.ok) {
            return new NextResponse("Session expired", { status: 401 });
        }

        const newCookies = refreshRes.headers.getSetCookie();

        let newAccessToken, newCsrfAccessToken;
        newCookies.forEach((c) => {
            if (c.startsWith("access_token_cookie="))
                newAccessToken = c.split(";")[0].split("=")[1];
            if (c.startsWith("csrf_access_token="))
                newCsrfAccessToken = c.split(";")[0].split("=")[1];
        });

        if (!newAccessToken || !newCsrfAccessToken) {
            return new NextResponse("Token refresh failed", { status: 500 });
        }

        const retryRes = await fetch(`${process.env.FLASK_API_URL}${path}`, {
            method: req.method,
            headers: {
                "Content-Type": "application/json",
                Cookie: `access_token_cookie=${newAccessToken}`,
                "X-CSRF-TOKEN": newCsrfAccessToken,
            },
            body: bodyContent, // Same body content for retry
        });

        const finalResponse = new NextResponse(retryRes.body, {
            status: retryRes.status,
            statusText: retryRes.statusText,
            headers: retryRes.headers,
        });
        
        newCookies.forEach((c) => {
            finalResponse.headers.append("Set-Cookie", c);
        });
        
        return finalResponse;
    }

    const response = new NextResponse(apiRes.body, {
        status: apiRes.status,
        statusText: apiRes.statusText,
        headers: apiRes.headers,
    });

    // Forward any Set-Cookie headers from Flask
    if (isAuthEndpoint) {
        const setCookieHeaders = apiRes.headers.getSetCookie();
        setCookieHeaders.forEach((cookie) => {
            response.headers.append("Set-Cookie", cookie);
        });
    }

    return response;
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
