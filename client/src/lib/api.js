const BASE_URL = "https://mwangazalanguagehub.onrender.com";

export async function apiRequest(endpoint, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.error || data.message || `Request failed (${response.status})`
      );
    }

    return data;
  } catch (error) {
    clearTimeout(timeout);
    console.error("API ERROR:", error);

    if (error.name === "AbortError") {
      throw new Error(
        "Request timed out. The server may be waking up — please try again in a moment."
      );
    }

    if (error.message === "Failed to fetch") {
      throw new Error(
        "Cannot connect to server. Check backend URL, CORS, or if Render service is live."
      );
    }

    throw error;
  }
}