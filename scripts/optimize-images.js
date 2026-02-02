const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Get all JPEG images
const images = fs.readdirSync(imagesDir)
  .filter(file => file.match(/\.(jpg|jpeg)$/i) && !file.includes('public/images'));

console.log(`Found ${images.length} images to optimize:\n`);

// Convert each image to WebP
Promise.all(images.map(async (filename) => {
  const inputPath = path.join(imagesDir, filename);
  const outputPath = path.join(imagesDir, filename.replace(/\.(jpg|jpeg)$/i, '.webp'));

  const inputStats = fs.statSync(inputPath);
  const inputSize = (inputStats.size / 1024).toFixed(2);

  try {
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputSize = (outputStats.size / 1024).toFixed(2);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✅ ${filename}`);
    console.log(`   ${inputSize} KB → ${outputSize} KB (${savings}% smaller)\n`);
  } catch (error) {
    console.error(`❌ Error converting ${filename}:`, error.message);
  }
})).then(() => {
  console.log('\n🎉 Image optimization complete!');

  // Calculate total savings
  const jpgFiles = images.map(f => path.join(imagesDir, f));
  const webpFiles = images.map(f => path.join(imagesDir, f.replace(/\.(jpg|jpeg)$/i, '.webp')));

  const totalJpgSize = jpgFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  const totalWebpSize = webpFiles.reduce((sum, file) => {
    try {
      return sum + fs.statSync(file).size;
    } catch {
      return sum;
    }
  }, 0);

  const totalSavings = ((1 - totalWebpSize / totalJpgSize) * 100).toFixed(1);

  console.log(`\n📊 Total size: ${(totalJpgSize / 1024 / 1024).toFixed(2)} MB → ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Total savings: ${totalSavings}%`);
});
