import { execSync } from 'child_process';

console.log('\n🚀 Starting TrustLink Full Automated Quality & Test Suite...\n');

try {
  console.log('--- Phase 1: Vitest Unit & Integration Suites (385 tests) ---');
  execSync('npm run test', { stdio: 'inherit' });

  console.log('\n--- Phase 2: Real-time Load & Performance Benchmark ---');
  execSync('node scripts/load-test.js', { stdio: 'inherit' });

  console.log('--- Phase 3: Selenium Web E2E Verification ---');
  execSync('node scripts/selenium-test.js', { stdio: 'inherit' });

  console.log('--- Phase 4: Appium Mobile E2E Verification ---');
  execSync('node scripts/appium-test.js', { stdio: 'inherit' });

  console.log('--- Phase 5: Security & OWASP Assessment ---');
  execSync('node scripts/security-audit.js', { stdio: 'inherit' });

  console.log('--- Phase 6: Compile Summary Report & Metrics ---');
  execSync('node scripts/generate-summary-report.js', { stdio: 'inherit' });

  console.log('🎉 ALL TEST PHASES COMPLETED WITH 100% PASS RATE!\n');
} catch (error) {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
}
