import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.LOCAL_BACKEND_URL
      : process.env.PROD_BACKEND_URL,
  withCredentials: true,
});

// Request interceptor
axios.interceptors.request.use(
  function (config) {
    console.log(
      "➡️ Sending request:",
      `${config.baseURL ?? ""}${config.url ?? ""}`,
      "Payload:",
      config.data ? JSON.stringify(config.data) : "No body"
    );
    return config;
  },
  function (error) {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  function (response) {
    console.log(
      "✅ Received response:",
      `${response.config.baseURL ?? ""}${response.config.url ?? ""}`,
      "Data:",
      JSON.stringify(response.data)
    );
    return response;
  },
  function (error) {
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error(
        "❌ Response error:",
        `${error.response.config.baseURL ?? ""}${
          error.response.config.url ?? ""
        }`,
        "Status:",
        error.response.status,
        "Data:",
        JSON.stringify(error.response.data)
      );
    } else if (error.request) {
      // No response received
      console.error("❌ No response received:", error.request);
    } else {
      // Something else happened
      console.error("❌ Error setting up response:", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
