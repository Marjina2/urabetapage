const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    const nextDir = path.join(process.cwd(), '.next');
    const publicDir = path.join(process.cwd(), 'public');
    const buildDir = path.join(process.cwd(), 'build');

    // Ensure directories exist
    await fs.ensureDir(nextDir);
    await fs.ensureDir(buildDir);

    // Handle netlify.toml if it exists
    const netlifyPath = path.join(process.cwd(), 'netlify.toml');
    if (fs.existsSync(netlifyPath)) {
      await fs.copy(netlifyPath, path.join(buildDir, 'netlify.toml'));
      console.log('netlify.toml copied successfully');
    } else {
      console.log('netlify.toml not found, skipping copy.');
    }

    // Copy public directory if it exists
    if (fs.existsSync(publicDir)) {
      await fs.copy(publicDir, nextDir, {
        overwrite: true,
        filter: (src) => {
          // Skip node_modules and .next
          return !src.includes('node_modules') && 
                 !src.startsWith(nextDir);
        }
      });
      console.log('Public files copied successfully');
    }

    // Copy static assets
    const staticFiles = ['robots.txt', 'sitemap.xml', 'favicon.ico'];
    for (const file of staticFiles) {
      const srcPath = path.join(publicDir, file);
      if (fs.existsSync(srcPath)) {
        await fs.copy(srcPath, path.join(nextDir, file));
      }
    }

    console.log('Files copied successfully');
  } catch (err) {
    // Log error but don't exit to prevent build failure
    console.warn('Warning during file copy:', err);
  }
}

copyFiles().catch(err => {
  console.warn('Warning during file copy:', err);
});