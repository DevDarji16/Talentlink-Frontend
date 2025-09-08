
let csrfToken = null;

const BASE_URL = "https://talentlink-nloa.onrender.com";


export const initCsrf = async () => {
  try {
    const res = await fetch(`${BASE_URL}/csrf/`, {
      method: "GET",
      credentials: "include", 
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


export const apiClient = async (url, method = "GET", body = null) => {
  let options = {
    method,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method !== "GET" && csrfToken) {
    options.headers["X-CSRFToken"] = csrfToken;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    let response = await fetch(BASE_URL + url, options);

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
