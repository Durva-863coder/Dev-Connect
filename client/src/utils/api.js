const API_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

/**
 * Native fetch wrapper for DevConnect API calls.
 * Ensures HTTP-only cookies credentials are included,
 * handles Bearer token header injection as fallback,
 * and formats response errors consistently.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Get token from localStorage as fallback Bearer token
  const token = localStorage.getItem('token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Crucial for reading/writing HTTP-only auth cookies
  };

  // If body is object, stringify it
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Parse JSON safely
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = response.status;
      error.errors = data.errors || [];
      throw error;
    }

    return data; // Returns standard format: { success: true, message, data }
  } catch (error) {
    if (!error.status) {
      error.message = 'Connection error. Please check if backend is online.';
    }
    throw error;
  }
};
