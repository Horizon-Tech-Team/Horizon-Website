import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  console.log("➡️ Inside middleware");

  const refreshToken = req.cookies.get("refresh_token")?.value;
  const accessToken = req.cookies.get("access_token")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = ["/login", "/register", "/cl/register"].includes(pathname);
  const isProtectedPage = [
    "/profile",
    "/dashboard",
    "/volunteer",
    "/admin",
    "/cl/students",
    "/leaderboard",
  ].some((route) => pathname.startsWith(route));

  // ✅ Case 1: User has access token and tries to visit login/register
  if (accessToken && isAuthPage) {
    console.log(
      "🔄 Logged-in user trying to access auth page, redirecting to /events"
    );
    const url = req.nextUrl.clone();
    url.pathname = "/events";
    return NextResponse.redirect(url);
  }

  // ✅ Case 2: User already logged in — let them access protected pages
  if (accessToken && isProtectedPage) {
    console.log("✅ Access token found, proceeding...");
    return NextResponse.next();
  }

  // ✅ Case 3: No access token, but refresh token exists — try to refresh
  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(
        `${process.env.LOCAL_BACKEND_URL}/auth/refresh_token`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      if (!res.ok) {
        console.log("❌ Token refresh failed");
        return handleUnauthenticated(pathname, req);
      }

      const data = await res.json();
      if (data.access_token) {
        console.log("✅ Token refreshed, setting new access token");
        const response = NextResponse.next();
        response.cookies.set("access_token", data.access_token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600,
        });
        return response;
      }

      return handleUnauthenticated(pathname, req);
    } catch (error) {
      console.error("❌ Error refreshing token:", error);
      return handleUnauthenticated(pathname, req);
    }
  }

  // ✅ Case 4: No tokens at all — redirect if trying to access protected pages
  if (!accessToken && !refreshToken && isProtectedPage) {
    console.log("❌ No tokens, redirecting to /login");
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Otherwise just proceed
  return NextResponse.next();
};

function handleUnauthenticated(pathname: string, req: NextRequest) {
  if (["/login", "/register"].includes(pathname)) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/cl/:path*",
    "/volunteer/:path*",
    "/admin/:path*",
    "/leaderboard/:path*",
  ],
};
