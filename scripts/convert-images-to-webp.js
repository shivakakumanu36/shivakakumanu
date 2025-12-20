const imagemin = require('imagemin');
const webp = require('imagemin-webp').default || require('imagemin-webp');
const path = require('path');
const fs = require('fs');

const inputDir = path.join(__dirname, '..', 'static', 'img');
const outputDir = inputDir;

(async () => {
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpe?g|png)$/i.test(f));
  if (files.length === 0) {
    console.log('No JPG or PNG images found in static/img.');
    return;
  }
  await imagemin(files.map(f => path.join(inputDir, f)), {
    destination: outputDir,
    plugins: [
      webp({ quality: 80 })
    ]
  });
  console.log('Converted to WebP:', files);
})();
