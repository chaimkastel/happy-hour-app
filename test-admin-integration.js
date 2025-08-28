#!/usr/bin/env node

/**
 * Test Admin Integration
 * Verifies that the monitoring system is properly integrated into the admin panel
 */

console.log('🧪 Testing Admin Monitoring Integration...\n');

// Test 1: Check if MonitoringDashboard component file exists
const fs = require('fs');
const path = require('path');

const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function runTest(name, testFn) {
  try {
    const result = testFn();
    if (result) {
      console.log(`✅ ${name}`);
      testResults.passed++;
      testResults.tests.push({ name, status: 'PASSED' });
    } else {
      console.log(`❌ ${name}`);
      testResults.failed++;
      testResults.tests.push({ name, status: 'FAILED', error: 'Test returned false' });
    }
  } catch (error) {
    console.log(`❌ ${name} - ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAILED', error: error.message });
  }
}

// Test 1: MonitoringDashboard component exists
runTest('MonitoringDashboard component file exists', () => {
  return fs.existsSync('./components/MonitoringDashboard.tsx');
});

// Test 2: Admin page imports MonitoringDashboard
runTest('Admin page imports MonitoringDashboard', () => {
  const adminPageContent = fs.readFileSync('./app/admin/page.tsx', 'utf8');
  return adminPageContent.includes("import MonitoringDashboard from '@/components/MonitoringDashboard'");
});

// Test 3: Admin page has monitoring tab
runTest('Admin page has monitoring tab state', () => {
  const adminPageContent = fs.readFileSync('./app/admin/page.tsx', 'utf8');
  return adminPageContent.includes("'monitoring'") && adminPageContent.includes("'health'") && adminPageContent.includes("'errors'");
});

// Test 4: Monitoring API endpoints exist
runTest('Monitoring API endpoints exist', () => {
  return fs.existsSync('./app/api/admin/monitoring/route.ts') && 
         fs.existsSync('./app/api/admin/health/route.ts') &&
         fs.existsSync('./app/api/admin/errors/route.ts');
});

// Test 5: Core monitoring library exists
runTest('Core monitoring library exists', () => {
  return fs.existsSync('./lib/monitoring.ts') && fs.existsSync('./lib/error-tracking.ts');
});

// Test 6: Enhanced middleware exists
runTest('Enhanced middleware exists', () => {
  return fs.existsSync('./lib/enhanced-middleware.ts');
});

// Test 7: Background daemon exists and is executable
runTest('Background monitoring daemon exists', () => {
  const daemonPath = './scripts/monitoring-daemon.js';
  if (!fs.existsSync(daemonPath)) return false;
  
  // Check if file is executable (basic check)
  const stats = fs.statSync(daemonPath);
  return (stats.mode & parseInt('111', 8)) !== 0; // Check execute permissions
});

// Test 8: Setup script exists
runTest('Setup script exists and is executable', () => {
  const setupPath = './scripts/setup-monitoring.sh';
  if (!fs.existsSync(setupPath)) return false;
  
  const stats = fs.statSync(setupPath);
  return (stats.mode & parseInt('111', 8)) !== 0;
});

// Test 9: Package.json has monitoring scripts
runTest('Package.json has monitoring scripts', () => {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const scripts = packageJson.scripts;
  return scripts['monitor:start'] && scripts['monitor:stop'] && scripts['monitor:status'] && scripts['health:check'];
});

// Test 10: Documentation files exist
runTest('Documentation files exist', () => {
  return fs.existsSync('./MONITORING.md') && 
         fs.existsSync('./MONITORING_QUICKSTART.md') &&
         fs.existsSync('./ADMIN_MONITORING_INTEGRATION.md');
});

// Test 11: Prisma schema has ErrorLog model
runTest('Prisma schema includes ErrorLog model', () => {
  const schemaContent = fs.readFileSync('./prisma/schema.prisma', 'utf8');
  return schemaContent.includes('model ErrorLog') && 
         schemaContent.includes('errorLogs       ErrorLog[]') &&
         schemaContent.includes('@@map("error_logs")');
});

// Test 12: Admin page has error tracking UI
runTest('Admin page has error tracking implementation', () => {
  const adminPageContent = fs.readFileSync('./app/admin/page.tsx', 'utf8');
  return adminPageContent.includes('Error Tracking') && 
         adminPageContent.includes('ErrorLog') &&
         adminPageContent.includes('fetchErrorData');
});

// Test 13: Environment example file exists
runTest('Environment variables documented', () => {
  // Check if there's documentation about required env vars
  const monitoringDocs = fs.readFileSync('./MONITORING.md', 'utf8');
  return monitoringDocs.includes('DATABASE_URL') && 
         monitoringDocs.includes('NEXTAUTH_URL') && 
         monitoringDocs.includes('NEXTAUTH_SECRET');
});

// Test 14: UI components have proper imports
runTest('UI components are properly imported', () => {
  const dashboardContent = fs.readFileSync('./components/MonitoringDashboard.tsx', 'utf8');
  return dashboardContent.includes("from './ui/Card'") && 
         dashboardContent.includes("from './ui/Badge'") &&
         dashboardContent.includes("from './ui/Button'");
});

// Test 15: Admin navigation includes all monitoring tabs
runTest('Admin navigation includes all monitoring tabs', () => {
  const adminPageContent = fs.readFileSync('./app/admin/page.tsx', 'utf8');
  return adminPageContent.includes('Real-time Monitoring') && 
         adminPageContent.includes('System Health') &&
         adminPageContent.includes('Error Tracking') &&
         adminPageContent.includes('<Bug className="w-5 h-5" />');
});

console.log('\n' + '='.repeat(50));
console.log('📊 INTEGRATION TEST SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

if (testResults.failed > 0) {
  console.log('\n🚨 FAILED TESTS:');
  testResults.tests
    .filter(test => test.status === 'FAILED')
    .forEach(test => {
      console.log(`  • ${test.name}: ${test.error}`);
    });
}

console.log('\n🎯 NEXT STEPS:');
if (testResults.failed === 0) {
  console.log('  ✨ All integration tests passed!');
  console.log('  🚀 Your admin monitoring integration is ready to use');
  console.log('  📖 See ADMIN_MONITORING_INTEGRATION.md for usage guide');
} else if (testResults.failed <= 3) {
  console.log('  🔧 Minor issues detected - check failed tests above');
  console.log('  📖 Most integration is complete');
} else {
  console.log('  🛠️ Several integration issues need attention');
  console.log('  📖 Review failed tests and fix issues');
}

console.log('\n📋 TO USE THE MONITORING:');
console.log('  1. Complete setup: ./scripts/setup-monitoring.sh');
console.log('  2. Start app: npm run dev');
console.log('  3. Start monitoring: npm run monitor:start');
console.log('  4. Access admin: http://localhost:3000/admin');
console.log('  5. Check "Real-time Monitoring" tab');

console.log('\n✨ Integration test completed!');

// Exit with error code if tests failed
process.exit(testResults.failed > 0 ? 1 : 0);