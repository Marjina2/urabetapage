const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    // Ensure out directory exists
    await fs.ensureDir('out');

    // Copy public files
    if (fs.existsSync('public')) {
      await fs.copy('public', 'out', { 
        overwrite: true,
        filter: (src) => !src.includes('node_modules')
      });
    }

    // Copy Netlify configuration
    await fs.copy('netlify.toml', 'out/netlify.toml');

    console.log('Files copied successfully');
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}

copyFiles(); 