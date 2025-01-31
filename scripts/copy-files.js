const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    // Log environment for debugging
    console.log('Environment:', process.env.NODE_ENV);

    // Ensure out directory exists
    await fs.ensureDir('out');

    // Copy public files
    if (fs.existsSync('public')) {
      await fs.copy('public', 'out', { 
        overwrite: true,
        filter: (src) => !src.includes('node_modules')
      });
    }

    // Copy Netlify configuration and functions
    await fs.copy('netlify.toml', 'out/netlify.toml');
    if (fs.existsSync('netlify/functions')) {
      await fs.copy('netlify/functions', 'out/netlify/functions');
    }

    // Copy environment-specific files
    if (process.env.NODE_ENV === 'production') {
      if (fs.existsSync('.env.production')) {
        await fs.copy('.env.production', 'out/.env.production');
      }
    }

    console.log('Files copied successfully');
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}

copyFiles(); 