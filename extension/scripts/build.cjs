// scripts/build.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function build() {
  try {
    // Clean dist directory
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true });
    }

    // Run TypeScript compilation
    console.log('Running TypeScript compilation...');
    execSync('tsc', { stdio: 'inherit' });

    // Run Vite build
    console.log('Running Vite build...');
    execSync('vite build', { stdio: 'inherit' });

    // Update manifest
    console.log('Updating manifest...');
    const manifestPath = path.join(__dirname, '../dist/manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Manifest file not found in dist directory');
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.background = {
      scripts: ["assets/browser-polyfill.js", "assets/background.js"],
      type: "module"
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Build completed successfully!');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();