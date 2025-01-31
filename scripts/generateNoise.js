const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const dir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Create the noise texture
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(200, 200);
const data = imageData.data;

for (let i = 0; i < data.length; i += 4) {
  const value = Math.random() * 255;
  data[i] = value;     // red
  data[i + 1] = value; // green
  data[i + 2] = value; // blue
  data[i + 3] = 15;    // alpha
}

ctx.putImageData(imageData, 0, 0);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(dir, 'noise.png'), buffer);

console.log('Generated noise.png successfully!'); 