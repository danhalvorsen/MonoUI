import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const srcDir = path.join(rootDir, 'src');

async function main() {
  try {
    console.log('Building mr-style-cli...');

    // Create dist directory if it doesn't exist
    await fs.mkdir(distDir, { recursive: true });

    // Copy package.json to dist
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    // Update package.json for distribution
    delete packageJson.scripts;
    delete packageJson.devDependencies;
    
    // Write updated package.json to dist
    await fs.writeFile(
      path.join(distDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf-8'
    );
    
    // Copy bin directory if it exists
    try {
      await fs.cp(
        path.join(rootDir, 'bin'),
        path.join(distDir, 'bin'),
        { recursive: true }
      );
    } catch (error) {
      console.log('No bin directory found, skipping...');
    }

    // Copy bin file
    const srcPath = path.join(__dirname, '..', 'src', 'cli.js');
    const destPath = path.join(distDir, 'cli.js');
    await fs.copyFile(srcPath, destPath);

    // Make the output file executable
    try {
      fsSync.chmodSync(destPath, 0o755);
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
