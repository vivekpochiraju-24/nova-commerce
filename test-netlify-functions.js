// Test Netlify serverless functions locally
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock Netlify function handler
const testFunction = (handler, event) => {
  return new Promise((resolve) => {
    handler(event, {}, (statusCode, body) => {
      resolve({ statusCode, body });
    });
  });
};

// Test registration function
async function testRegistration() {
  console.log('🧪 Testing Registration Function...');
  
  try {
    // Import the registration function
    const registerPath = path.join(__dirname, 'netlify', 'functions', 'api', 'auth', 'register.js');
    const module = await import(`file://${registerPath}`);
    const { handler } = module;
    
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
    
    const result = await testFunction(handler, event);
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

// Test login function
async function testLogin() {
  console.log('\n🧪 Testing Login Function...');
  
  try {
    // Import the login function
    const loginPath = path.join(__dirname, 'netlify', 'functions', 'api', 'auth', 'login.js');
    const module = await import(`file://${loginPath}`);
    const { handler } = module;
    
    // Test admin login
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        email: 'admin@vebstore.com',
        password: 'admin123'
      }),
      headers: {}
    };
    
    const result = await testFunction(handler, event);
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

// Test products function
async function testProducts() {
  console.log('\n🧪 Testing Products Function...');
  
  try {
    // Import the products function
    const productsPath = path.join(__dirname, 'netlify', 'functions', 'api', 'products.js');
    const module = await import(`file://${productsPath}`);
    const { handler } = module;
    
    const event = {
      httpMethod: 'GET',
      headers: {}
    };
    
    const result = await testFunction(handler, event);
    const products = JSON.parse(result.body);
    
    console.log('✅ Products Test Result:', {
      statusCode: result.statusCode,
      productCount: Array.isArray(products) ? products.length : 0,
      firstProduct: Array.isArray(products) && products.length > 0 ? products[0].name : 'No products'
    });
    
    return result.statusCode === 200;
    
  } catch (error) {
    console.error('❌ Products Test Failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Testing Netlify Serverless Functions...\n');
  
  const results = await Promise.all([
    testRegistration(),
    testLogin(),
    testProducts()
  ]);
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All Netlify functions are working correctly!');
    console.log('✅ Ready for Netlify deployment!');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
}

runTests();
