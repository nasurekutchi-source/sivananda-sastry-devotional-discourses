/**
 * Cross-platform data copy script.
 * Copies data/processed/ → public/data/processed/ before Next.js build.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'data', 'processed');
const DEST = path.join(__dirname, '..', 'public', 'data', 'processed');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source ${src} does not exist, skipping copy.`);
    return;
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(SRC, DEST);
console.log('Data copied to public/data/processed/');
