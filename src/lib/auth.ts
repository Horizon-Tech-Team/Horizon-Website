// // lib/getCurrentUser.ts
// import { cookies } from "next/headers";

// export async function getCurrentUser() {
//   const cookieStore = await cookies();
//   let accessToken = cookieStore.get("access_token")?.value;
//   const refreshToken = cookieStore.get("refresh_token")?.value;

//   if (!accessToken && !refreshToken) return null;

//   // Function to fetch user
//   const fetchUser = async (token: string) => {
//     const res = await fetch(`${process.env.LOCAL_BACKEND_URL}/auth/me`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: "include",
//       cache: "no-store",
//     });

//     if (!res.ok) return null;
//     return await res.json();
//   };

//   let user = await fetchUser(accessToken!);

//   // If the access token failed, try refreshing
//   if (!user && refreshToken) {
//     try {
//       const refreshRes = await fetch(
//         `${process.env.LOCAL_BACKEND_URL}/auth/refresh_token`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${refreshToken}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!refreshRes.ok) return null;

//       const refreshData = await refreshRes.json();
//       accessToken = refreshData.access_token;

//       // Try fetching user again with new access token
//       user = await fetchUser(accessToken!);
//     } catch (err) {
//       console.error("Error refreshing token:", err);
//       return null;
//     }
//   }

//   return user;
// }

// import axios from "@/lib/axios";

// export async function getCurrentUserClient() {
//   try {
//     const response = await axios.get(`/auth/me`, {
//       withCredentials: true,
//     });

//     return { success: true, data: response.data };
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     return {
//       success: false,
//       error: err?.response?.data?.message || "Failed to fetch user.",
//     };
//   }
// }

export async function getCurrentUserClient() {
  try {
    const response = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to fetch user.",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Client fetch error:", error);
    return {
      success: false,
      error: "Failed to fetch user.",
    };
  }
}
