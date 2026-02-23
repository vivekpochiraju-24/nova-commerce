// Netlify serverless function for user registration
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory storage (in production, use a database)
let users = [];

// Mock admin user
const adminUser = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@vebstore.com',
  password: bcrypt.hashSync('admin123', 10),
  isAdmin: true,
  createdAt: new Date().toISOString()
};

// Initialize with admin user
if (users.length === 0) {
  users.push(adminUser);
}

const handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }

    const { name, email, password, phone, address } = JSON.parse(event.body);

    // Validation
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Name, email, and password are required' })
      };
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User already exists' })
      };
    }

    // Create new user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Registration successful',
        user: userWithoutPassword,
        token
      })
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Registration failed' })
    };
  }
};

module.exports = { handler };
