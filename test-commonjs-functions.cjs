// Test CommonJS Netlify serverless functions
const path = require('path');

// Test login function
async function testLogin() {
  console.log('🧪 Testing CommonJS Login Function...');
  
  try {
    // Import the login function
    const loginPath = path.join(__dirname, 'netlify', 'functions', 'api', 'auth', 'login.js');
    const { handler } = require(loginPath);
    
    // Test admin login
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        email: 'admin@vebstore.com',
        password: 'admin123'
      }),
      headers: {}
    };
    
    const context = {};
    const result = await handler(event, context);
    const response = JSON.parse(result.body);
    
    console.log('✅ Login Test Result:', {
      statusCode: result.statusCode,
      message: response.message,
      user: response.user ? response.user.name : 'No user',
      isAdmin: response.user ? response.user.isAdmin : false,
      token: response.token ? 'Token generated' : 'No token'
    });
    
    return result.statusCode === 200;
    
  } catch (error) {
    console.error('❌ Login Test Failed:', error.message);
    return false;
  }
}

// Test registration function
async function testRegistration() {
  console.log('\n🧪 Testing CommonJS Registration Function...');
  
  try {
    // Import the registration function
    const registerPath = path.join(__dirname, 'netlify', 'functions', 'api', 'auth', 'register.js');
    const { handler } = require(registerPath);
    
    // Test event
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        address: 'Test Address'
      }),
      headers: {}
    };
    
    const context = {};
    const result = await handler(event, context);
    const response = JSON.parse(result.body);
    
    console.log('✅ Registration Test Result:', {
      statusCode: result.statusCode,
      message: response.message,
      user: response.user ? response.user.name : 'No user',
      token: response.token ? 'Token generated' : 'No token'
    });
    
    return result.statusCode === 200;
    
  } catch (error) {
    console.error('❌ Registration Test Failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Testing CommonJS Netlify Serverless Functions...\n');
  
  const results = await Promise.all([
    testLogin(),
    testRegistration()
  ]);
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All CommonJS Netlify functions are working correctly!');
    console.log('✅ Ready for Netlify deployment!');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
}

runTests();
