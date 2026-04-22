const axios = require('axios');

async function checkServices() {
  console.log('=== Checking Services Status ===\n');
  
  // Check Order Service
  console.log('Checking Order Service (port 3003)...');
  try {
    const response = await axios.get('http://localhost:3003/orders', { timeout: 2000 });
    console.log('✓ Order Service is running (got orders endpoint)');
  } catch (err) {
    console.error('✗ Order Service is NOT running');
    console.error('  Error:', err.code || err.message);
  }
  
  // Check Payment Service
  console.log('\nChecking Payment Service (port 3004)...');
  try {
    const response = await axios.get('http://localhost:3004/', { timeout: 2000 });
    console.log('✓ Payment Service is running:', response.data);
  } catch (err) {
    console.error('✗ Payment Service is NOT running');
    console.error('  Error:', err.code || err.message);
  }
  
  // Check Food Service
  console.log('\nChecking Food Service (port 3002)...');
  try {
    const response = await axios.get('http://localhost:3002/foods', { timeout: 2000 });
    console.log('✓ Food Service is running (got foods)');
  } catch (err) {
    console.error('✗ Food Service is NOT running');
    console.error('  Error:', err.code || err.message);
  }
  
  // Check User Service
  console.log('\nChecking User Service (port 3001)...');
  try {
    const response = await axios.get('http://localhost:3001/users/1', { timeout: 2000 });
    console.log('✓ User Service is running (got user endpoint)');
  } catch (err) {
    console.error('✗ User Service is NOT running');
    console.error('  Error:', err.code || err.message);
  }
  
  console.log('\n=== Check Complete ===');
}

checkServices();
