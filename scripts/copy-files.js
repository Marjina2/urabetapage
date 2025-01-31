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

    // Ensure favicon exists
    const faviconSource = path.join(process.cwd(), 'public', 'favicon.ico');
    const faviconDest = path.join(outDir, 'favicon.ico');
    
    if (fs.existsSync(faviconSource)) {
      await fs.copy(faviconSource, faviconDest, {
        overwrite: true,
        errorOnExist: false
      });
    }

    // Copy Netlify files
    const netlifyToml = path.join(process.cwd(), 'netlify.toml');
    const netlifyFunctions = path.join(process.cwd(), 'netlify', 'functions');

    if (fs.existsSync(netlifyToml)) {
      await fs.copy(netlifyToml, path.join(outDir, 'netlify.toml'), {
        overwrite: true,
        errorOnExist: false
      });
    }

    if (fs.existsSync(netlifyFunctions)) {
      await fs.copy(netlifyFunctions, path.join(outDir, 'netlify', 'functions'), {
        overwrite: true,
        errorOnExist: false
      });
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