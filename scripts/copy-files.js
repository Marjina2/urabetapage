const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    const outDir = path.join(process.cwd(), 'out');
    const publicDir = path.join(process.cwd(), 'public');
    const distDir = path.join(process.cwd(), 'dist');

    // Ensure directories exist
    await fs.ensureDir(outDir);

    // Copy public directory
    if (fs.existsSync(publicDir)) {
      await fs.copy(publicDir, outDir, {
        overwrite: true,
        filter: (src) => {
          return !src.includes('node_modules') && 
                 !src.startsWith(outDir);
        }
      });
    }

    // Copy dist files if they exist
    if (fs.existsSync(distDir)) {
      await fs.copy(distDir, outDir, { overwrite: true });
    }

    // Create route directories and copy index.html
    const indexHtml = path.join(outDir, 'index.html');
    if (fs.existsSync(indexHtml)) {
      const routes = ['dashboard', 'settings', 'onboarding', 'privacy', 'terms', 'contact'];
      for (const route of routes) {
        const routeDir = path.join(outDir, route);
        await fs.ensureDir(routeDir);
        await fs.copy(indexHtml, path.join(routeDir, 'index.html'));
      }
    }

    // Create .nojekyll file for GitHub Pages (if needed)
    await fs.writeFile(path.join(outDir, '.nojekyll'), '');

    console.log('Files copied successfully');
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(0);
  }
}

copyFiles().catch(() => process.exit(0));