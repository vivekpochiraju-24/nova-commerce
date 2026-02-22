// Comprehensive test of the login flow
import axios from 'axios';

// Simulate the frontend environment
const API_URL = 'http://localhost:3001';

// Mock localStorage
const localStorage = {
  data: {},
  setItem(key, value) {
    this.data[key] = value;
    console.log(`✅ Stored ${key}:`, value.substring(0, 50) + '...');
  },
  getItem(key) {
    return this.data[key] || null;
  },
  removeItem(key) {
    delete this.data[key];
    console.log(`🗑️ Removed ${key}`);
  }
};

async function testCompleteFlow() {
  console.log('🚀 Starting comprehensive login flow test...\n');
  
  try {
    // Step 1: Test login request
    console.log('📤 Step 1: Sending login request...');
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@vebstore.com',
      password: 'admin123'
    });
    
    console.log('✅ Login response received:', response.data);
    
    // Step 2: Validate response structure
    console.log('\n🔍 Step 2: Validating response structure...');
    if (!response.data.user) {
      throw new Error('Missing user in response');
    }
    if (!response.data.token) {
      throw new Error('Missing token in response');
    }
    if (!response.data.user.isAdmin) {
      throw new Error('User is not admin');
    }
    console.log('✅ Response structure is valid');
    
    // Step 3: Simulate frontend storage
    console.log('\n💾 Step 3: Storing in localStorage...');
    localStorage.setItem('vebstore_token', response.data.token);
    localStorage.setItem('vebstore_user', JSON.stringify(response.data.user));
    
    // Step 4: Verify stored data
    console.log('\n🔍 Step 4: Verifying stored data...');
    const storedToken = localStorage.getItem('vebstore_token');
    const storedUser = localStorage.getItem('vebstore_user');
    
    if (!storedToken) {
      throw new Error('Token not stored');
    }
    if (!storedUser) {
      throw new Error('User not stored');
    }
    
    const parsedUser = JSON.parse(storedUser);
    console.log('✅ Stored data verified');
    console.log('👤 User:', parsedUser.name, '| Admin:', parsedUser.isAdmin);
    
    // Step 5: Test authenticated request
    console.log('\n🔐 Step 5: Testing authenticated request...');
    const authResponse = await axios.get(`${API_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${storedToken}`
      }
    });
    
    console.log('✅ Authenticated request successful');
    console.log('📊 Users data:', authResponse.data.length > 0 ? `${authResponse.data.length} users found` : 'No users');
    
    console.log('\n🎉 ALL TESTS PASSED! Admin login flow is working correctly.');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

testCompleteFlow();
