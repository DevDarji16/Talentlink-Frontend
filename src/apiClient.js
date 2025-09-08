// apiClient.js

let csrfToken = null;

const BASE_URL = "https://talentlink-nloa.onrender.com";

/**
 * Initialize CSRF token by hitting backend endpoint.
 * Make sure your Django backend has a view like:
 *   def get_csrf(request): return JsonResponse({"csrfToken": get_token(request)})
 */
export const initCsrf = async () => {
  try {
    const res = await fetch(`${BASE_URL}/csrf/`, {
      method: "GET",
      credentials: "include", // ensures cookies (sessionid, csrftoken) are sent/stored
    });

    if (!res.ok) {
      throw new Error("Failed to fetch CSRF token");
    }

    const data = await res.json();
    csrfToken = data.csrfToken;
  } catch (error) {
    console.error("Error initializing CSRF:", error);
  }
};

/**
 * Generic API client for making requests to Django backend
 */
export const apiClient = async (url, method = "GET", body = null) => {
  let options = {
    method,
    credentials: "include", // very important for cookies (sessionid, csrftoken)
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Attach CSRF token only for unsafe methods
  if (method !== "GET" && csrfToken) {
    options.headers["X-CSRFToken"] = csrfToken;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    let response = await fetch(BASE_URL + url, options);

    // If 403 (CSRF fail), refresh token and retry once
    if (response.status === 403) {
      console.warn("CSRF failed, re-initializing...");
      await initCsrf();

      if (csrfToken) {
        options.headers["X-CSRFToken"] = csrfToken;
        response = await fetch(BASE_URL + url, options);
      }
    }

    return response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
