import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
    const path = req.nextUrl.pathname.replace("/api", "");
    const cookieStore = cookies();
    
    const accessToken = cookieStore.get("access_token_cookie")?.value;
    const csrfAccessToken = cookieStore.get("csrf_access_token")?.value;

    // convert body to string if it doesn't exist
    let bodyContent = null;
    if (req.body) {
        try {
            const body = await req.json();
            bodyContent = JSON.stringify(body);
        } catch (error) {
            // If it's not JSON, try to get it as text
            try {
                bodyContent = await req.text();
            } catch (e) {
                console.warn("Could not parse request body:", e);
            }
        }
    }

    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        method: req.method,
        headers: {
            "Content-Type": "application/json",
            Cookie: `access_token_cookie=${accessToken}`,
            "X-CSRF-TOKEN": csrfAccessToken || "",
        },
        body: bodyContent,
    });

    if (apiRes.status === 401) {
        const refreshToken = cookieStore.get("refresh_token_cookie")?.value;
        const csrfRefreshToken = cookieStore.get("csrf_refresh_token")?.value;

        if (!refreshToken || !csrfRefreshToken) {
            console.log("❌ No refresh tokens available");
            return new NextResponse("Authentication required", { status: 401 });
        }

        const refreshRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/token/refresh`,
            {
                method: "POST",
                headers: {
                    Cookie: `refresh_token_cookie=${refreshToken}`,
                    "X-CSRF-TOKEN": csrfRefreshToken,
                },
            },
        );

        console.log(`Refresh response status: ${refreshRes.status}`);

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

        const retryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
            method: req.method,
            headers: {
                "Content-Type": "application/json",
                Cookie: `access_token_cookie=${newAccessToken}`,
                "X-CSRF-TOKEN": newCsrfAccessToken,
            },
            body: bodyContent,
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

    return new NextResponse(apiRes.body, {
        status: apiRes.status,
        statusText: apiRes.statusText,
        headers: apiRes.headers,
    });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
