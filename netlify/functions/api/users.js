// Netlify serverless function for getting all users
import jwt from 'jsonwebtoken';

// In-memory storage (in production, use a database)
let users = [];

// Mock admin user
const adminUser = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@vebstore.com',
  isAdmin: true,
  createdAt: new Date().toISOString()
};

// Initialize with admin user
if (users.length === 0) {
  users.push(adminUser);
}

const handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }

    // Get token from headers
    const token = event.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'No token provided' })
      };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user is admin
    const user = users.find(u => u.id === decoded.id);
    if (!user || !user.isAdmin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Access denied' })
      };
    }

    // Return all users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    return {
      statusCode: 200,
      body: JSON.stringify(usersWithoutPasswords)
    };

  } catch (error) {
    console.error('Get users error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' })
    };
  }
};

export { handler };
