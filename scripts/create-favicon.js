const fs = require('fs');
const path = require('path');

// Basic 16x16 favicon data (transparent)
const faviconData = Buffer.from([
  0,0,1,0,1,0,16,16,0,0,1,0,32,0,68,4,
  0,0,22,0,0,0,40,0,0,0,16,0,0,0,32,0,
  0,0,1,0,32,0,0,0,0,0,0,4,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
]);

const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');

try {
  fs.writeFileSync(faviconPath, faviconData);
  console.log('Favicon created successfully');
} catch (err) {
  console.error('Error creating favicon:', err);
  process.exit(1);
} 