// Create the noise texture
const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
const ctx = canvas.getContext('2d');

if (ctx) {
  const imageData = ctx.createImageData(200, 200);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i] = value;     // red
    data[i + 1] = value; // green
    data[i + 2] = value; // blue
    data[i + 3] = 15;    // alpha (very subtle)
  }

  ctx.putImageData(imageData, 0, 0);
  
  // Save as PNG
  const pngData = canvas.toDataURL('image/png');
  const base64Data = pngData.replace(/^data:image\/png;base64,/, '');
  
  // Write to file
  require('fs').writeFileSync('public/images/noise.png', Buffer.from(base64Data, 'base64'));
} 