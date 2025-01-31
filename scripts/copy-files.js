const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    const outDir = path.join(process.cwd(), 'out');
    const nextDir = path.join(process.cwd(), '.next');
    const publicDir = path.join(process.cwd(), 'public');

    // Ensure directories exist
    await fs.ensureDir(outDir);
    await fs.ensureDir(nextDir);

    // Copy Next.js build output
    if (fs.existsSync(nextDir)) {
      await fs.copy(nextDir, outDir, {
        overwrite: true,
        errorOnExist: false
      });
    }

    // Copy public directory if it exists
    if (fs.existsSync(publicDir)) {
      await fs.copy(publicDir, outDir, {
        overwrite: true,
        errorOnExist: false,
        filter: (src) => !src.includes('node_modules')
      });
    }

    // Ensure index.html exists
    const indexHtml = path.join(outDir, 'index.html');
    if (!fs.existsSync(indexHtml)) {
      await fs.copy(path.join(outDir, '404.html'), indexHtml);
    }

    // Copy environment files
    if (fs.existsSync('.env.production')) {
      await fs.copy('.env.production', path.join(outDir, '.env.production'));
    }

    console.log('Files copied successfully');
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}

copyFiles().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 