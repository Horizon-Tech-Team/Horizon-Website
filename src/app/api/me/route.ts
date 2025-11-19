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
  } // ✅ You were missing this closing bracket

  const backendURL =
    process.env.NODE_ENV === "development"
      ? process.env.LOCAL_BACKEND_URL
      : process.env.PROD_BACKEND_URL;

  try {
    const response = await fetch(`${backendURL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      // credentials: "include" is not needed here since you're already extracting the cookie
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to fetch user" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
