const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    const outDir = path.join(process.cwd(), 'out');
    const publicDir = path.join(process.cwd(), 'public');
    const nextDir = path.join(process.cwd(), '.next');

    // Ensure out directory exists
    await fs.ensureDir(outDir);

    // Copy public directory
    if (fs.existsSync(publicDir)) {
      await fs.copy(publicDir, outDir, {
        overwrite: true,
        filter: (src) => !src.includes('node_modules')
      });
    }

    // Copy Next.js static files
    const nextStaticDir = path.join(nextDir, 'static');
    if (fs.existsSync(nextStaticDir)) {
      await fs.copy(
        nextStaticDir,
        path.join(outDir, '_next', 'static'),
        { overwrite: true }
      );
    }

    // Copy environment file if it exists
    const envFile = path.join(process.cwd(), '.env.production');
    if (fs.existsSync(envFile)) {
      await fs.copy(envFile, path.join(outDir, '.env.production'));
    }

    console.log('Files copied successfully');
  } catch (err) {
    console.error('Error copying files:', err);
    console.log('Continuing build despite copy error');
  }
}

copyFiles().catch(console.error); 