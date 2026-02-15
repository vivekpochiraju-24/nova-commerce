// Simple email test using fetch
const testEmail = async () => {
  try {
    console.log('🧪 Testing email with fetch...');
    
    const response = await fetch('http://localhost:3001/api/send-order-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerEmail: 'vivekpochiraju@gmail.com',
        customerName: 'Test Customer',
        orderDetails: {
          orderId: 'VEBTEST123',
          paymentMethod: 'PayPal',
          items: [{ name: 'Test Product', quantity: 1, price: 999 }]
        },
        totalAmount: 1178
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Check your inbox for the test email');
    } else {
      console.log('❌ Email failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testEmail();
