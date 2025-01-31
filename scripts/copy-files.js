const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    // Ensure out directory exists
    await fs.ensureDir('out');

    // Copy Netlify configuration and functions
    await fs.copy('netlify.toml', 'out/netlify.toml');
    if (fs.existsSync('netlify/functions')) {
      await fs.copy('netlify/functions', 'out/netlify/functions');
    }

    // Copy public files if they exist
    if (fs.existsSync('public')) {
      await fs.copy('public', 'out');
    }

    console.log('Files copied successfully');
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}

copyFiles(); 