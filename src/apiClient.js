// In src/apiClient.js

const getCookie = (name) => {
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
  }
  return null;
};

const BASE_URL = "https://talentlink-nloa.onrender.com";

/**
 * This function makes a simple GET request to the backend.
 * Its only purpose is to receive the `csrftoken` cookie in the response.
 */
export const ensureCsrfToken = () => {
  return fetch(BASE_URL + "/csrf/", {
    method: "GET",
    credentials: "include",
  });
};

export const apiClient = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  };

  // Only add the CSRF token for 'unsafe' methods.
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    const csrfToken = getCookie('csrftoken');
    
    // **THE FIX**: Only set the header if the token is a valid string.
    if (csrfToken) {
      options.headers['X-CSRFToken'] = csrfToken;
    } else {
      console.error("CSRF token is missing. The request will likely fail.");
      // You could try calling ensureCsrfToken() here as a last resort,
      // but it's better to do it when the app loads.
    }
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(BASE_URL + url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `Request failed with status ${response.status}`
    }));
    throw new Error(JSON.stringify(errorData));
  }

  if (response.status === 204) { // Handle No Content response
    return null;
  }

  return response.json();
};