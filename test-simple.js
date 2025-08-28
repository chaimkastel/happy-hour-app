#!/usr/bin/env node

async function testRedirect() {
  console.log('Testing redirect behavior...');
  
  try {
    const response = await fetch('https://orderhappyhour.com/merchant');
    console.log('Status:', response.status);
    console.log('Status text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 307) {
      console.log('✅ Redirect working correctly');
    } else {
      console.log('❌ Unexpected status:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testRedirect();
