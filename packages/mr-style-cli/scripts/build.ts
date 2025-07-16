import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up paths
const rootDir = path.resolve(__dirname, '..', '..'); // Go up two levels from dist/scripts/build.js
const distDir = path.join(rootDir, 'dist');
const srcDir = path.join(rootDir, 'src');

// Debug paths
console.log('Root dir:', rootDir);
console.log('Dist dir:', distDir);
console.log('Source dir:', srcDir);

async function main() {
  try {
    console.log('Finalizing build...');

    // Ensure dist directory and its subdirectories exist
    await fs.mkdir(distDir, { recursive: true });
    await fs.mkdir(path.join(distDir, 'bin'), { recursive: true });
    await fs.mkdir(path.join(distDir, 'scripts'), { recursive: true });

    // Read and process package.json
    const packageJsonPath = path.join(rootDir, 'package.json');
    console.log('Reading package.json from:', packageJsonPath);
    
    if (!fsSync.existsSync(packageJsonPath)) {
      throw new Error(`package.json not found at: ${packageJsonPath}`);
    }
    
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    // Create a clean package.json for distribution
    const distPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      type: packageJson.type,
      bin: packageJson.bin,
      exports: packageJson.exports,
      dependencies: packageJson.dependencies || {},
      peerDependencies: packageJson.peerDependencies || {}
    };
    
    console.log('Creating dist package.json with:', JSON.stringify(distPackageJson, null, 2));
    
    // Write updated package.json to dist
    await fs.writeFile(
      path.join(distDir, 'package.json'),
      JSON.stringify(distPackageJson, null, 2),
      'utf-8'
    );
    
    // Ensure bin directory exists in dist
    await fs.mkdir(path.join(distDir, 'bin'), { recursive: true });
    
    // Copy bin file
    const binSource = path.join(rootDir, 'bin', 'cli.js');
    const binDest = path.join(distDir, 'bin', 'cli.js');
    
    if (fsSync.existsSync(binSource)) {
      await fs.copyFile(binSource, binDest);
      // Make the file executable
      if (process.platform !== 'win32') {
        fsSync.chmodSync(binDest, '755');
      }
    } else {
      console.log('No bin/cli.js found, skipping...');
    }

    // Make the output file executable if it exists
    try {
      const destPath = path.join(distDir, 'cli.js');
      if (fsSync.existsSync(destPath)) {
        fsSync.chmodSync(destPath, 0o755);
      }
    } catch (error) {
      console.error('Warning: Could not set executable permissions:', error);
    }

    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main();
