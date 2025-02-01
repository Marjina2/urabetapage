const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    const nextDir = path.join(process.cwd(), '.next');
    const publicDir = path.join(process.cwd(), 'public');

    // Ensure next directory exists
    await fs.ensureDir(nextDir);

    // Copy public directory if it exists
    if (fs.existsSync(publicDir)) {
      await fs.copy(publicDir, nextDir, {
        overwrite: true,
        filter: (src) => {
          return !src.includes('node_modules') && 
                 !src.startsWith(nextDir);
        }
      });
    }

    // Create route directories and copy index.html
    const indexHtml = path.join(nextDir, 'index.html');
    if (fs.existsSync(indexHtml)) {
      const routes = ['dashboard', 'settings', 'onboarding', 'privacy', 'terms', 'contact'];
      for (const route of routes) {
        const routeDir = path.join(nextDir, route);
        await fs.ensureDir(routeDir);
        await fs.copy(indexHtml, path.join(routeDir, 'index.html'));
      }
    }

    // Create .nojekyll file for GitHub Pages
    await fs.writeFile(path.join(nextDir, '.nojekyll'), '');

    console.log('Files copied successfully');
  } catch (err) {
    // Log error but don't exit to prevent build failure
    console.warn('Warning during file copy:', err);
  }
}

copyFiles().catch(err => {
  console.warn('Warning during file copy:', err);
  // Don't exit with error to allow build to continue
});