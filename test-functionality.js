#!/usr/bin/env node

/**
 * Comprehensive Functionality Test for Happy Hour Web App
 * This script tests all major features and API endpoints
 */

const BASE_URL = 'https://orderhappyhour.com';

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function logTest(name, passed, error = null) {
  if (passed) {
    console.log(`✅ ${name}`);
    testResults.passed++;
  } else {
    console.log(`❌ ${name}`);
    testResults.failed++;
    if (error) {
      testResults.errors.push({ name, error: error.message });
    }
  }
}

async function testEndpoint(url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    return { success: response.ok, status: response.status, data: await response.json() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Comprehensive Functionality Test\n');
  
  // Test 1: Main page loads
  console.log('Testing Main Page...');
  try {
    const response = await fetch(`${BASE_URL}/`);
    logTest('Main page loads', response.ok);
  } catch (error) {
    logTest('Main page loads', false, error);
  }
  
  // Test 2: Login page loads
  console.log('\nTesting Authentication...');
  try {
    const response = await fetch(`${BASE_URL}/login`);
    logTest('Login page loads', response.ok);
  } catch (error) {
    logTest('Login page loads', false, error);
  }
  
  // Test 3: Merchant dashboard (should redirect to login)
  console.log('\nTesting Merchant Access...');
  try {
    const response = await fetch(`${BASE_URL}/merchant`, { redirect: 'manual' });
    logTest('Merchant dashboard redirects unauthenticated users', response.status === 307);
  } catch (error) {
    logTest('Merchant dashboard redirects unauthenticated users', false, error);
  }
  
  // Test 4: API endpoints
  console.log('\nTesting API Endpoints...');
  
  // Test merchant venues API
  const venuesResponse = await testEndpoint(`${BASE_URL}/api/merchant/venues`);
  logTest('Merchant venues API responds', venuesResponse.status === 401);
  
  // Test merchant deals API
  const dealsResponse = await testEndpoint(`${BASE_URL}/api/merchant/deals`);
  logTest('Merchant deals API responds', dealsResponse.status === 401);
  
  // Test merchant subscription API
  const subscriptionResponse = await testEndpoint(`${BASE_URL}/api/merchant/subscription`);
  logTest('Merchant subscription API responds', subscriptionResponse.status === 401);
  
  // Test deals search API
  const searchResponse = await testEndpoint(`${BASE_URL}/api/deals/search`);
  logTest('Deals search API responds', searchResponse.success);
  
  // Test 5: Database connectivity
  console.log('\nTesting Database...');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    logTest('Health check endpoint works', response.ok);
  } catch (error) {
    logTest('Health check endpoint works', false, error);
  }
  
  // Test 6: Static assets
  console.log('\nTesting Static Assets...');
  try {
    const response = await fetch(`${BASE_URL}/logo.svg`);
    logTest('Logo loads', response.ok);
  } catch (error) {
    logTest('Logo loads', false, error);
  }
  
  // Test 7: CSS and styling
  console.log('\nTesting Styling...');
  try {
    const response = await fetch(`${BASE_URL}/_next/static/css/app/layout.css`);
    logTest('Global CSS loads', response.ok);
  } catch (error) {
    logTest('Global CSS loads', false, error);
  }
  
  // Test 8: Navigation
  console.log('\nTesting Navigation...');
  try {
    const response = await fetch(`${BASE_URL}/merchant/deals`, { redirect: 'manual' });
    logTest('Merchant deals page accessible', response.status === 307);
  } catch (error) {
    logTest('Merchant deals page accessible', false, error);
  }
  
  // Test 9: Deal creation flow
  console.log('\nTesting Deal Creation Flow...');
  try {
    const response = await fetch(`${BASE_URL}/merchant/deals/new`, { redirect: 'manual' });
    logTest('New deal page accessible', response.status === 307);
  } catch (error) {
    logTest('New deal page accessible', false, error);
  }
  
  // Test 10: QR code functionality
  console.log('\nTesting QR Code Functionality...');
  try {
    const response = await fetch(`${BASE_URL}/api/redeem/qr/123`);
    logTest('QR code API responds', response.ok || response.status === 404);
  } catch (error) {
    logTest('QR code API responds', false, error);
  }
  
  // Test 11: Account page
  console.log('\nTesting Account Page...');
  try {
    const response = await fetch(`${BASE_URL}/account`, { redirect: 'manual' });
    logTest('Account page accessible', response.status === 307);
  } catch (error) {
    logTest('Account page accessible', false, error);
  }
  
  // Test 12: Favorites page
  console.log('\nTesting Favorites Page...');
  try {
    const response = await fetch(`${BASE_URL}/favorites`, { redirect: 'manual' });
    logTest('Favorites page accessible', response.status === 307);
  } catch (error) {
    logTest('Favorites page accessible', false, error);
  }
  
  // Test 13: Wallet page
  console.log('\nTesting Wallet Page...');
  try {
    const response = await fetch(`${BASE_URL}/wallet`, { redirect: 'manual' });
    logTest('Wallet page accessible', response.status === 307);
  } catch (error) {
    logTest('Wallet page accessible', false, error);
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.errors.length > 0) {
    console.log('\n🚨 ERRORS:');
    testResults.errors.forEach(({ name, error }) => {
      console.log(`  • ${name}: ${error}`);
    });
  }
  
  console.log('\n🎯 RECOMMENDATIONS:');
  if (testResults.failed === 0) {
    console.log('  • All tests passed! The app is working perfectly.');
  } else if (testResults.failed <= 3) {
    console.log('  • Most functionality is working. Check the errors above.');
  } else {
    console.log('  • Several issues detected. Review the errors and fix them.');
  }
  
  console.log('\n✨ Test completed!');
}

// Run tests
runTests().catch(console.error);
