// In src/apiClient.js

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(trimmed.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const BASE_URL = "https://talentlink-nloa.onrender.com";

export const apiClient = async (url, method = 'GET', body = null) => {
  let options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  };

  // Add the CSRF token to non-GET requests initially
  if (method.toUpperCase() !== 'GET') {
    options.headers['X-CSRFToken'] = getCookie('csrftoken');
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    let response = await fetch(BASE_URL + url, options);

    // If we get a 403, it's likely a CSRF issue.
    if (response.status === 403) {
      console.log("CSRF verification failed. Attempting to get a new token...");

      // 1. Fetch a new CSRF cookie from your backend
      await fetch(BASE_URL + "/csrf/", {
        method: "GET",
        credentials: "include",
      });

      // 2. CRITICAL FIX: Re-read the new token from the cookies
      const newCsrfToken = getCookie('csrftoken');
      
      if (newCsrfToken) {
        // 3. Update the request headers with the new token
        options.headers['X-CSRFToken'] = newCsrfToken;

        console.log("New token acquired. Retrying the original request...");
        // 4. Retry the request with the updated options
        response = await fetch(BASE_URL + url, options);
      }
    }

    // Handle the final response
    if (!response.ok) {
        // Try to parse error JSON, otherwise throw a generic error
        const errorData = await response.json().catch(() => ({ error: `Request failed with status ${response.status}` }));
        throw new Error(JSON.stringify(errorData));
    }
    
    // Handle successful but empty responses (like 204 No Content)
    if (response.status === 204) {
        return;
    }

    return response.json();

  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};