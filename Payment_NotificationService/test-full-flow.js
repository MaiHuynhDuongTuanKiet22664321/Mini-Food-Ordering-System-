const axios = require('axios');

async function testFullFlow() {
  try {
    console.log('=== Testing Full Payment Flow ===\n');
    
    // Step 1: Check if services are running
    console.log('Step 1: Checking services...');
    try {
      await axios.get('http://localhost:3003/orders');
      console.log('✓ Order Service is running');
    } catch (err) {
      console.error('✗ Order Service is NOT running. Please start it first.');
      return;
    }
    
    try {
      await axios.get('http://localhost:3004/');
      console.log('✓ Payment Service is running');
    } catch (err) {
      console.error('✗ Payment Service is NOT running. Please start it first.');
      return;
    }
    
    // Step 2: Create a test order
    console.log('\nStep 2: Creating test order...');
    const orderData = {
      userId: 1,
      items: [
        { foodId: 1, quantity: 2, price: 45000 }
      ]
    };
    
    let orderResponse;
    try {
      orderResponse = await axios.post('http://localhost:3003/orders', orderData);
      console.log('✓ Order created:', orderResponse.data);
    } catch (err) {
      console.error('✗ Failed to create order:', err.response?.data || err.message);
      return;
    }
    
    // Step 3: Create payment for the order
    console.log('\nStep 3: Creating payment...');
    const paymentData = {
      orderId: orderResponse.data.id,
      userId: 1,
      method: 'COD'
    };
    
    let paymentResponse;
    try {
      paymentResponse = await axios.post('http://localhost:3004/payments', paymentData);
      console.log('✓ Payment created:', paymentResponse.data);
    } catch (err) {
      console.error('✗ Failed to create payment:', err.response?.data || err.message);
      return;
    }
    
    // Step 4: Fetch notifications
    console.log('\nStep 4: Fetching notifications...');
    try {
      const notifResponse = await axios.get('http://localhost:3004/notifications/1');
      console.log('✓ Notifications:', notifResponse.data);
    } catch (err) {
      console.error('✗ Failed to fetch notifications:', err.response?.data || err.message);
    }
    
    console.log('\n=== Full Flow Test Completed Successfully ===');
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Full error:', error);
  }
}

testFullFlow();
