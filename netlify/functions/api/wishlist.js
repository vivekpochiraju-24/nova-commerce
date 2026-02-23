// Netlify serverless function for wishlist

// Mock wishlist data
let wishlistItems = [];

const handler = async (event, context) => {
  try {
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        body: JSON.stringify(wishlistItems)
      };
    } else if (event.httpMethod === 'POST') {
      const newItem = JSON.parse(event.body);
      newItem.id = `wishlist-${Date.now()}`;
      newItem.addedDate = new Date().toISOString();
      wishlistItems.push(newItem);
      
      return {
        statusCode: 201,
        body: JSON.stringify(newItem)
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }
  } catch (error) {
    console.error('Wishlist error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};

export { handler };
