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
    execSync('node scripts/create-favicon.js', { stdio: 'inherit' });

    // Run next build
    console.log('Building Next.js app...');
    execSync('next build', { stdio: 'inherit' });

    // Copy files
    console.log('Copying files...');
    execSync('node scripts/copy-files.js', { stdio: 'inherit' });

    // Generate sitemap
    console.log('Generating sitemap...');
    execSync('next-sitemap', { stdio: 'inherit' });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

cleanBuild(); 