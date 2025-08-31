// apiClient.js
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
  const csrfToken = getCookie('csrftoken');
  
  let options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'  // This is crucial for cookies
  };

  // Only add CSRF token for non-GET requests
  if (method !== 'GET' && csrfToken) {
    options.headers['X-CSRFToken'] = csrfToken;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(BASE_URL + url, options);
    
    if (response.status === 403) {
      // CSRF token might be missing or invalid, try to get a new one
      await fetch(BASE_URL + "/csrf/", {
        method: "GET",
        credentials: "include",
      });
      // Retry the original request
      return await fetch(BASE_URL + url, options);
    }
    
    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};