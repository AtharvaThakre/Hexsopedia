// API Configuration
// Update API_BASE_URL to point to your backend deployment

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Helper function for API calls
export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If API_BASE_URL is empty, use relative URLs (for same-domain deployments)
  if (!API_BASE_URL) {
    return normalizedEndpoint;
  }
  
  // Otherwise, prepend the base URL
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

export default API_BASE_URL;
