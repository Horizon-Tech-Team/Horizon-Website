/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  ChangePasswordSchema,
  CLRegisterSchema,
  LoginSchema,
  PasswordRequestSchema,
  RegisterSchema,
  ResetPasswordSchema,
  UpdateSchema,
} from "@/lib/validation";
import axios from "@/lib/axios";
import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

export const loginAction = async (formData: FormData) => {
  const validateFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  console.log("Fields are Validated");

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await axios.post("/auth/login", { email, password });

    const data = await response.data;
    console.log(response.headers["set-cookie"]);
    const cookieStore = await cookies();
    const cookieData = setCookieParser(response.headers["set-cookie"]!);

    cookieData.forEach((cookie: any) => {
      cookieStore.set(cookie.name, cookie.value, { ...cookie });
    });

    console.log(data);

    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Login failed. Please try again.";
    return { errors: { general: message } };
  }
};

export const resetPasswordRequest = async (formData: FormData) => {
  const validateFields = PasswordRequestSchema.safeParse({
    email: formData.get("email"),
  });

  console.log("Fields are Validated");

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }

  const email = formData.get("email");

  try {
    const response = await axios.post("/auth/password-reset-request", {
      email,
    });
    const data = response.data;

    console.log(data);

    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Request failed. Please try again.";
    return { errors: { general: message } };
  }
};

export const resetPassword = async (token: string, formData: FormData) => {
  const validateFields = ResetPasswordSchema.safeParse({
    new_password: formData.get("new_password"),
    confirm_new_password: formData.get("confirm_new_password"),
  });

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }

  try {
    const response = await axios.post(`/auth/password-reset-confirm/${token}`, {
      new_password: formData.get("new_password"),
      confirm_new_password: formData.get("confirm_new_password"),
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;

    return {
      error: res?.message || "Password reset failed.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
};

export const verifyAccountAction = async (token: string) => {
  try {
    const response = await axios.get(`/auth/verify/${token}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    const res = error?.response?.data;

    return {
      error: res?.message || "Account verification failed.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
};

export const updateProfileAction = async (formData: FormData) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  const validated = UpdateSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    branch: formData.get("branch"),
    year_of_study: Number(formData.get("year_of_study")),
    // email and college_name are not included intentionally
  });

  if (!validated.success) {
    console.log("Validation errors:", validated.error.flatten().fieldErrors);
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    const response = await axios.post("/auth/update-profile", validated.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Profile update failed.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
};

export const changePasswordAction = async (formData: FormData) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  const validateFields = ChangePasswordSchema.safeParse({
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
    confirm_new_password: formData.get("confirm_new_password"),
  });

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }

  try {
    const response = await axios.post(
      "/auth/change-password",
      {
        current_password: formData.get("current_password"),
        new_password: formData.get("new_password"),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;

    return {
      error: res?.message || "Password change failed.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
};

// export const signupAction = async (
//   formData: FormData,
//   type: "student" | "contingent_leader" = "student"
// ) => {
//   const year_of_study_raw = formData.get("year_of_study");
//   const year_of_study = year_of_study_raw
//     ? Number(year_of_study_raw)
//     : undefined;

//   // Choose schema based on type
//   const schema =
//     type === "contingent_leader" ? CLRegisterSchema : RegisterSchema;
//   const validateFields = schema.safeParse({
//     firstName: formData.get("firstName"),
//     lastName: formData.get("lastName"),
//     email: formData.get("email"),
//     password: formData.get("password"),
//     gender: formData.get("gender"),
//     phone: formData.get("phone"),
//     college_name: formData.get("college_name"),
//     branch: formData.get("branch"),
//     year_of_study,
//     ...(type === "student" ? { cl_code: formData.get("cl_code") } : {}),
//   });

//   console.log("Fields are Validated");

//   if (!validateFields.success) {
//     return { errors: validateFields.error.flatten().fieldErrors };
//   }

//   // Prepare payload
//   const payload: any = {
//     firstName: formData.get("firstName"),
//     lastName: formData.get("lastName"),
//     email: formData.get("email"),
//     password: formData.get("password"),
//     gender: formData.get("gender"),
//     phone: formData.get("phone"),
//     college_name: formData.get("college_name"),
//     branch: formData.get("branch"),
//     year_of_study,
//   };
//   if (type === "student") {
//     payload.cl_code = formData.get("cl_code");
//   }

//   try {
//     const apiUrl =
//       type === "contingent_leader" ? "/cl/cl_signup" : "/auth/signup";

//     const response = await axios.post(apiUrl, payload);

//     const data = await response.data;

//     // Only set cookies for student registration (if needed)
//     if (type === "student" && response.headers["set-cookie"]) {
//       const cookieStore = await cookies();
//       const cookieData = setCookieParser(response.headers["set-cookie"]!);

//       cookieData.forEach((cookie: any) => {
//         cookieStore.set(cookie.name, cookie.value, { ...cookie });
//       });
//     }

//     console.log(data);

//     return data;
//   } catch (error: any) {
//     console.error(error);
//     const message =
//       error?.response?.data?.message || "Signup failed. Please try again.";
//     return { errors: { general: message } };
//   }
// };

export const signupAction = async (
  formData: FormData,
  type: "student" | "contingent_leader" = "student"
) => {
  const year_of_study_raw = formData.get("year_of_study");
  const year_of_study = year_of_study_raw
    ? Number(year_of_study_raw)
    : undefined;

  // ✅ Prepare cl_code before validation
  const cl_code_raw = formData.get("cl_code");
  const cl_code = cl_code_raw && cl_code_raw !== "" ? cl_code_raw : undefined;

  // Choose schema based on type
  const schema =
    type === "contingent_leader" ? CLRegisterSchema : RegisterSchema;

  // ✅ Use cl_code only if defined
  const validateFields = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    college_name: formData.get("college_name"),
    branch: formData.get("branch"),
    year_of_study,
    ...(type === "student" && cl_code !== undefined ? { cl_code } : {}),
  });

  console.log("Fields are Validated");

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }

  // Prepare payload
  const payload: any = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    college_name: formData.get("college_name"),
    branch: formData.get("branch"),
    year_of_study,
  };
  if (type === "student" && cl_code !== undefined) {
    payload.cl_code = cl_code;
  }

  try {
    const apiUrl =
      type === "contingent_leader" ? "/cl/cl_signup" : "/auth/signup";

    const response = await axios.post(apiUrl, payload);

    const data = await response.data;

    if (type === "student" && response.headers["set-cookie"]) {
      const cookieStore = await cookies();
      const cookieData = setCookieParser(response.headers["set-cookie"]!);

      cookieData.forEach((cookie: any) => {
        cookieStore.set(cookie.name, cookie.value, { ...cookie });
      });
    }

    console.log(data);

    return data;
  } catch (error: any) {
    console.error(error);
    const message =
      error?.response?.data?.message || "Signup failed. Please try again.";
    return { errors: { general: message } };
  }
};

export async function getAllRegistrations() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/registrations", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to fetch registrations",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

// export async function downloadRegistrationReport() {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("access_token")?.value;

//   if (!accessToken) {
//     return { success: false, error: "Unauthorized" };
//   }

//   try {
//     const response = await axios.get("/registrations/report/download", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       withCredentials: true,
//       responseType: "blob", // important for binary Excel file
//     });

//     // Create blob URL for Excel file
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "registration_report.xlsx");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);

//     return { success: true };
//   } catch (error: any) {
//     const res = error?.response?.data;
//     return {
//       success: false,
//       error: res?.message || "Failed to download registration report",
//       resolution: res?.resolution,
//       errorCode: res?.error_code,
//     };
//   }
// }

export async function downloadRegistrationReport() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await axios.get("/registrations/report/download", {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: "arraybuffer", // raw bytes
    });

    return {
      success: true,
      file: Buffer.from(response.data).toString("base64"), // pass file as base64
    };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: "Failed to download registration report" };
  }
}

export async function registerForEventAction(event_id: string, data: any) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken || !event_id)
    return { success: false, error: "Unauthorized or invalid event." };

  const reformedData = {
    ...data,
    team_name: data.teamName,
    team_members: data.teamMembers,
  };

  try {
    const response = await axios.post(
      `/registrations/${event_id}`,
      reformedData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: err?.response?.data?.message || "Registration failed.",
      error_code: err?.response?.data?.error_code || null,
    };
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: err?.response?.data?.message || "Failed to fetch user.",
    };
  }
}

export async function getAllEvents({
  q = "",
  category = "all",
  limit = 9,
  offset = 0,
}: {
  q?: string;
  category?: string;
  limit?: number;
  offset?: number;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  try {
    const response = await axios.get("/event", {
      params: { q, category, limit, offset },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data,
      total: response.data.length,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.response?.data?.message || "Failed to fetch events.",
    };
  }
}

export async function getEventById(event_id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!event_id) return { success: false, error: "invalid event ID." };

  try {
    const response = await axios.get(`/event/${event_id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: err?.response?.data?.message || "Failed to fetch event.",
    };
  }
}

export async function getAllRegistredEventsOfUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/registrations/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: err?.response?.data?.message || "Failed to fetch event.",
    };
  }
}

export async function getCLInfo() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/cl/get_contingent", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Profile update failed.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function getPRHistoryOfCl(cl_id?: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/pr/history", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
      params: cl_id ? { cl_id } : undefined,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to load PR history.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function getPRHistoryOfPR() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };
  try {
    const response = await axios.get("/pr/history/self", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to load PR history.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function getDashboardOfCL(cl_id?: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/cl/dashboard", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
      params: cl_id ? { cl_id } : undefined,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to load cl dashboard.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function getAllClDashboardAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const response = await axios.get("/cl/fullDashboard", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: err?.response?.data?.message || "Failed to fetch dashboard.",
      error_code: err?.response?.data?.error_code || null,
    };
  }
}

export async function getStudentsUnderCL() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/cl/get_students", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to load students under cl.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function getCl_code() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/cl/me/cl_code", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to load cl_code",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function findUsers({
  role,
  cl_uid,
  q,
}: {
  role?: string;
  cl_uid?: string;
  q?: string;
} = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/auth/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
      params: {
        ...(role ? { role } : {}),
        ...(cl_uid ? { cl_uid } : {}),
        ...(q ? { q } : {}),
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to load users",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function getEventList() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/event/list", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to load event list.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function getLeaderboard() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/pr/leaderboard", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      success: false,
      error: res?.message || "Failed to load leaderboard.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function assignEventAlias(
  contingentId: string,
  eventAlias: string
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await axios.patch(
      "/cl/assign_event_alias",
      { contingent_id: contingentId, event_alias: eventAlias },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      success: false,
      error: res?.detail || "Failed to assign event alias.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function getAppSettings() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await axios.get("/auth/settings", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      success: false,
      error: res?.detail || "Failed to fetch app settings.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function updateAppSettings(settings: any[]) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await axios.post("/auth/settings", settings, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      success: false,
      error: res?.detail || "Failed to update app settings.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function createOfflineRegistration(registrationData: {
  user_id: string;
  event_id: string;
  is_team_event?: boolean;
  team_name?: string;
  team_members?: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.post(
      "/registrations/offline",
      registrationData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Offline registration failed.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function awardPrPoints(payload: {
  cl_id: string;
  member_id?: string | null;
  event_id?: string | null;
  points: number;
  rule_type: string;
  description?: string | null;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.post("/pr/award", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    console.error(error);

    return {
      success: false,
      error: res?.message || "Failed to award PR points.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function uploadAvatar(file: File) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("/auth/avatar", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data }; // { url: "public_supabase_url" }
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      success: false,
      error: res?.detail || "Avatar upload failed.",
    };
  }
}

export async function deleteEvent(event_id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.delete(`/event/${event_id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to delete event",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function updateEvent(event_id: string, payload: any) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.patch(`/event/${event_id}`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to update event",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function createEvent(payload: any) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.post("/event", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to create event",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function viewInfoUser(user_id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.get("/auth/view_info", {
      params: { user_uid: user_id },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      error: res?.message || "Failed to fetch user info",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function updateAttendanceStatus(payload: {
  registration_ids: string[] | string;
  attendance_status: "present" | "absent";
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.patch("/registrations/attendance", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      success: false,
      error: res?.message || "Failed to update attendance",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function updateRegistrationStatus(payload: {
  registration_ids: string[] | string;
  registration_status: "registered" | "submitted" | "completed" | "cancelled";
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.patch("/registrations/status", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      success: false,
      error: res?.message || "Failed to update registration status",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}

export async function assignClCode(payload: {
  cl_code: string;
  user_ids?: string | string[];
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return { success: false, error: "Unauthorized" };

  try {
    const response = await axios.patch("/cl/assign_cl", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const res = error?.response?.data;
    return {
      success: false,
      error: res?.detail || "Failed to assign CL code.",
      resolution: res?.resolution,
      errorCode: res?.error_code,
    };
  }
}
