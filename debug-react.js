// Debug React-specific issues
console.log('🔍 Debugging React environment...');

// Check if environment variables are loaded
console.log('Environment variables:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

// Check if axios is available
try {
  const axios = require('axios');
  console.log('✅ Axios is available');
} catch (error) {
  console.log('❌ Axios not available:', error.message);
}

// Check if we can make requests to the backend
async function testBackendConnection() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@vebstore.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    console.log('✅ Backend connection successful:', data);
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
  }
}

testBackendConnection();
