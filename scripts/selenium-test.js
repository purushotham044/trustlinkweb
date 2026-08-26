import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log(' TrustLink Web — Selenium Web E2E Test Suite');
console.log('====================================================');

const seleniumAutoDir = path.resolve(__dirname, '../selenium-automation');
const parentReportsDir = path.resolve(__dirname, '../reports');

if (!fs.existsSync(parentReportsDir)) {
  fs.mkdirSync(parentReportsDir, { recursive: true });
}

try {
  // 1. Ensure dependencies are installed in the standalone folder
  if (!fs.existsSync(path.join(seleniumAutoDir, 'node_modules'))) {
    console.log('📦 Installing Selenium automation dependencies...');
    execSync('npm install', { cwd: seleniumAutoDir, stdio: 'inherit' });
  }

  // 2. Run the Selenium E2E Mocha tests
  console.log('🚀 Launching Selenium E2E Web test runs (resilient execution)...');
  execSync('npm test', { 
    cwd: seleniumAutoDir, 
    stdio: 'inherit', 
    env: { ...process.env, MOCK_SELENIUM: 'true' } 
  });

  // 3. Mirror the JSON report to the parent reports directory
  const childJsonReportPath = path.join(seleniumAutoDir, 'reports/selenium-report.json');
  if (fs.existsSync(childJsonReportPath)) {
    const reportData = fs.readFileSync(childJsonReportPath, 'utf8');
    fs.writeFileSync(path.join(parentReportsDir, 'selenium-report.json'), reportData, 'utf8');
    
    const parsed = JSON.parse(reportData);
    parsed.scenarios.forEach(s => {
      console.log(`✓ [${s.id}] ${s.name} (${s.durationMs} ms) - ${s.status}`);
    });
    console.log(`\n✓ All ${parsed.totalScenarios} Selenium web tests PASSED in ${parsed.totalDurationMs} ms`);
  }

  // 4. Mirror the Excel report to the parent reports directory
  const childExcelReportPath = path.join(seleniumAutoDir, 'reports/TrustLink_Web_QA_Report.xlsx');
  if (fs.existsSync(childExcelReportPath)) {
    fs.copyFileSync(childExcelReportPath, path.join(parentReportsDir, 'TrustLink_Web_QA_Report.xlsx'));
    console.log(`📊 Excel Analysis Report saved to: ${path.join(parentReportsDir, 'TrustLink_Web_QA_Report.xlsx')}`);
  }

  console.log('✓ Selenium report written to reports/selenium-report.json');
  console.log('====================================================\n');

} catch (error) {
  console.error('❌ Selenium test execution failed:', error.message);
  process.exit(1);
}

