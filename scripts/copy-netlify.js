const fs = require('fs-extra')
const path = require('path')

async function copyNetlifyFiles() {
  try {
    // Copy netlify.toml
    await fs.copy(
      path.join(process.cwd(), 'netlify.toml'),
      path.join(process.cwd(), 'out', 'netlify.toml')
    )

    // Copy netlify folder
    await fs.copy(
      path.join(process.cwd(), 'netlify'),
      path.join(process.cwd(), 'out', 'netlify')
    )

    console.log('Successfully copied Netlify files')
  } catch (err) {
    console.error('Error copying Netlify files:', err)
    process.exit(1)
  }
}

copyNetlifyFiles() 