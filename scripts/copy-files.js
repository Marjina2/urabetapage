const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    const outDir = path.join(process.cwd(), 'out');
    const nextDir = path.join(process.cwd(), '.next');

    // Ensure directories exist
    await fs.ensureDir(outDir);
    await fs.ensureDir(nextDir);

    // Copy Next.js build output
    if (fs.existsSync(nextDir)) {
      await fs.copy(nextDir, outDir);
    }

    // Copy public directory if it exists
    const publicDir = path.join(process.cwd(), 'public');
    if (fs.existsSync(publicDir)) {
      await fs.copy(publicDir, outDir, {
        overwrite: true
      });
    }

    // Copy Netlify files
    const netlifyToml = path.join(process.cwd(), 'netlify.toml');
    const netlifyFunctions = path.join(process.cwd(), 'netlify', 'functions');

    if (fs.existsSync(netlifyToml)) {
      await fs.copy(netlifyToml, path.join(outDir, 'netlify.toml'));
    }

    if (fs.existsSync(netlifyFunctions)) {
      await fs.copy(netlifyFunctions, path.join(outDir, 'netlify', 'functions'));
    }

    console.log('Files copied successfully');
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}

copyFiles(); 