import fs from 'fs';
import path from 'path';

const target = path.resolve(process.argv[2] || './packages');

function walk(targetPath, callback) {
  const stats = fs.statSync(targetPath);
  if (stats.isFile() && path.basename(targetPath) === 'index.ts') {
    callback(targetPath);
    return;
  }
  if (!stats.isDirectory()) return;

  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    const fullPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else if (entry.isFile() && entry.name === 'index.ts') {
      callback(fullPath);
    }
  }
}

function fixBarrel(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const fixed = content.replace(
    /(export\s+\*\s+from\s+['"])(\.\/[^'"]+?)(['"])/g,
    (_, p1, p2, p3) => (p2.endsWith('.js') ? `${p1}${p2}${p3}` : `${p1}${p2}.js${p3}`)
  );

  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
}

walk(target, fixBarrel);
