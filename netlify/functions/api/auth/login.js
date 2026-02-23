// Netlify serverless function for user login
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

    const { email, password } = JSON.parse(event.body);

    // Validation
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password are required' })
      };
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    // Check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Login successful',
        user: userWithoutPassword,
        token
      })
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Login failed' })
    };
  }
};

module.exports = { handler };
