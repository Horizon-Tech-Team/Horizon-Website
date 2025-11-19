// app/api/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No access token found" },
      { status: 401 }
    );
  }

  const backendURL =
    process.env.NODE_ENV === "development"
      ? process.env.LOCAL_BACKEND_URL
      : process.env.PROD_BACKEND_URL;

  try {
    const backendRes = await fetch(`${backendURL}/auth/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Backend logout failed" },
        { status: 500 }
      );
    }

    // Clear cookies from browser
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
    response.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
