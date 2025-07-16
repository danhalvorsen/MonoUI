import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {
    try {
        console.log('Building mr-style-cli...');
        // Create dist directory if it doesn't exist
        const distDir = path.join(__dirname, '..', 'dist');
        await fs.mkdir(distDir, { recursive: true });
        // Build TypeScript files
        try {
            execSync('npm run build', { stdio: 'inherit' });
        }
        catch (error) {
            console.error('Error building TypeScript files:', error);
            process.exit(1);
        }
        // Copy bin file
        const srcPath = path.join(__dirname, '..', 'src', 'cli.js');
        const destPath = path.join(distDir, 'cli.js');
        await fs.copyFile(srcPath, destPath);
        // Make the output file executable
        try {
            fs.chmodSync(destPath, 0o755);
        }
        catch (error) {
            console.error('Warning: Could not set executable permissions:', error);
        }
        console.log('Build completed successfully');
    }
    catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}
main();
