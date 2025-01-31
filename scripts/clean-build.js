const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function cleanBuild() {
  try {
    // Clean directories
    console.log('Cleaning directories...');
    await fs.remove('.next');
    await fs.remove('out');
    await fs.remove('node_modules/.cache');
    await fs.remove('public/favicon.ico');

    // Run npm install
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Create favicon
    console.log('Creating favicon...');
    execSync('npm run create-favicon', { stdio: 'inherit' });

    // Run next build and export
    console.log('Building Next.js app...');
    execSync('next build', { stdio: 'inherit' });

    // Create .nojekyll file
    console.log('Creating .nojekyll file...');
    execSync('npm run create-nojekyll', { stdio: 'inherit' });

    // Copy files
    console.log('Copying files...');
    execSync('npm run copy-files', { stdio: 'inherit' });

    // Copy environment files
    if (fs.existsSync('.env.production')) {
      await fs.copy('.env.production', 'out/.env.production');
    }
    if (fs.existsSync('.env.local')) {
      await fs.copy('.env.local', 'out/.env.local');
    }

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

cleanBuild(); 