// Test order email
import axios from 'axios';

const testOrder = async () => {
  try {
    console.log('🧪 Testing order confirmation email...');
    
    const orderData = {
      customerEmail: 'vivekpochiraju@gmail.com',
      customerName: 'Test Customer',
      orderDetails: {
        orderId: 'VEBTEST123',
        paymentMethod: 'PayPal',
        items: [
          { name: 'Test Product', quantity: 1, price: 999 }
        ]
      },
      totalAmount: 1178 // 999 + 18% tax
    };

    const response = await axios.post('http://localhost:3001/api/send-order-confirmation', orderData);
    
    console.log('✅ Email test successful!');
    console.log('📧 Check your inbox for the test email');
    console.log('📊 Response:', response.data);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    if (error.response) {
      console.error('🔍 Server response:', error.response.data);
    }
  }
};

testOrder();
