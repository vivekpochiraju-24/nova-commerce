// Test admin login directly
import axios from 'axios';

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@vebstore.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    console.log('User is admin:', response.data.user.isAdmin);
    console.log('Token:', response.data.token.substring(0, 50) + '...');
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

testAdminLogin();
