// Netlify serverless function for products

// Mock products data
const products = [
  {
    id: '1',
    name: 'Premium Laptop',
    price: 99999,
    originalPrice: 129999,
    category: 'Electronics',
    description: 'High-performance laptop with latest specs',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    inStock: true,
    rating: 4.5,
    reviews: 128,
    discount: 23
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 4999,
    originalPrice: 6999,
    category: 'Electronics',
    description: 'Premium noise-cancelling headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    inStock: true,
    rating: 4.3,
    reviews: 89,
    discount: 29
  },
  {
    id: '3',
    name: 'Smart Watch',
    price: 12999,
    originalPrice: 15999,
    category: 'Electronics',
    description: 'Feature-rich smartwatch with health tracking',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    inStock: true,
    rating: 4.6,
    reviews: 234,
    discount: 19
  }
];

const handler = async (event, context) => {
  try {
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        body: JSON.stringify(products)
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }
  } catch (error) {
    console.error('Products error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};

module.exports = { handler };
