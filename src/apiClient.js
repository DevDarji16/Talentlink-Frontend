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

// 👇 toggle this true/false manually
const production = true;

const BASE_URL = production 
  ? "https://talentlink-nloa.onrender.com"
  : "http://localhost:8000";

export const apiClient = async (url, method = 'GET', body = null) => {
  let options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    credentials: 'include'
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(BASE_URL + url, options);
  return response.json();
};
