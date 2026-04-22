const axios = require('axios');

async function testPayment() {
  try {
    console.log('Testing Payment API...');
    
    // Test payment
    const paymentData = {
      orderId: 'test-order-123',
      userId: 1,
      method: 'COD'
    };
    
    console.log('Sending payment request:', paymentData);
    
    const response = await axios.post('http://localhost:3004/payments', paymentData);
    
    console.log('Payment Response:', response.data);
    console.log('\n✓ Payment API working!');
    
    // Test fetching notifications
    console.log('\nFetching notifications for userId 1...');
    const notifResponse = await axios.get('http://localhost:3004/notifications/1');
    console.log('Notifications:', notifResponse.data);
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Full error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.request) {
      console.error('No response received. Request:', error.request);
    }
  }
}

testPayment();
