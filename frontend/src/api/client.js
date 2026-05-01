const BASE_URL = 'http://localhost:8000/api';

const client = async (endpoint, { body, ...customConfig } = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      localStorage.removeItem('access_token');
    }

    const data = await response.json();
    
    if (response.ok) {
      return data;
    }
    
    return Promise.reject(data);
  } catch (err) {
    return Promise.reject(err.message || err);
  }
};

export default client;
