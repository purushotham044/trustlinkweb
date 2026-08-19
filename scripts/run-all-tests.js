import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('============================================================');
console.log('🧪 TrustLink Web — Full Enterprise Test & Security Suite');
console.log('============================================================\n');

try {
  console.log('👉 Step 1: Running Vitest Unit, Validation & Security Suites...');
  execSync('npx vitest run', { cwd: rootDir, stdio: 'inherit' });
  console.log('\n');

  console.log('👉 Step 2: Running Load Time & Performance Benchmark Suite...');
  execSync('node scripts/load-test.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('\n');

  console.log('👉 Step 3: Running Security & Vulnerability Assessment...');
  execSync('node scripts/security-audit.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('\n');

  console.log('👉 Step 4: Running Selenium Web E2E Test Suite...');
  execSync('node scripts/selenium-test.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('\n');

  console.log('👉 Step 5: Running Appium Mobile Viewport Test Suite...');
  execSync('node scripts/appium-test.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('\n');

  console.log('👉 Step 6: Generating Consolidated Summary Reports...');
  execSync('node scripts/generate-summary-report.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('\n');

  console.log('============================================================');
  console.log('🎉 ALL 300+ TEST CASES & SUITES PASSED SUCCESSFULLY!');
  console.log('📄 Reports available in: D:\\PDD\\trustlinkweb\\reports\\');
  console.log('============================================================');
} catch (error) {
  console.error('\n❌ Test Execution Failed:', error.message);
  process.exit(1);
}
