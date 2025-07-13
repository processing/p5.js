const { execSync } = require('node:child_process');
const { join } = require('node:path');
const { existsSync } = require('node:fs');

const testDirs = ['typescript', 'react', 'vuejs'];
const rootDir = process.cwd(); 

for (const dir of testDirs) {
  const testPath = join(rootDir, 'test', 'integrations', dir);
  if (!existsSync(testPath)) {
    console.warn(`⚠️ Skipping missing directory: ${dir}`);
    continue;
  }

  console.log(`\n🧪 Running integration test in: ${dir}`);
  process.chdir(testPath);
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('🚀 Running type check...');
  execSync('npm run test', { stdio: 'inherit' });

  process.chdir(rootDir); 
}
