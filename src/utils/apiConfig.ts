// Dynamic API configuration for development and production
export const getApiUrl = (): string => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Check for custom API URL in environment
  const customApiUrl = import.meta.env.VITE_API_URL;
  
  if (customApiUrl && customApiUrl !== '/api') {
    // Use custom URL if provided (for development)
    return customApiUrl;
  }
  
  if (isDevelopment) {
    // Development: use localhost
    return 'http://localhost:3001';
  }
  
  // Production: use Netlify functions
  return '/api';
};

export const getWebSocketUrl = (): string => {
  const isDevelopment = import.meta.env.DEV;
  const customApiUrl = import.meta.env.VITE_API_URL;
  
  if (customApiUrl && customApiUrl !== '/api') {
    // Development WebSocket URL
    return customApiUrl.replace('http', 'ws');
  }
  
  if (isDevelopment) {
    // Development WebSocket
    return 'ws://localhost:3001';
  }
  
  // Production: Netlify doesn't support WebSockets in serverless functions
  // Return null and handle gracefully in the application
  console.warn('WebSocket not supported in Netlify serverless functions');
  return null;
};

export const apiConfig = {
  getApiUrl,
  getWebSocketUrl
};
