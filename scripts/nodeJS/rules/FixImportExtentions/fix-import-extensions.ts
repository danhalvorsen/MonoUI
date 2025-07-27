import fs from "fs";
import path from "path";
import glob from "glob";

// Root where packages live
const rootDir = path.resolve(process.cwd(), "packages");

// Grab all .ts and .tsx files in src/ and tests/
const tsFiles = glob.sync("**/*.{ts,tsx}", {
  cwd: rootDir,
  absolute: true,
  ignore: ["**/node_modules/**", "**/dist/**"]
});

// Regex for relative imports without extension
const importRegex = /from\s+['"](\.\/[^'"]+)['"]/g;

let fixedCount = 0;

for (const file of tsFiles) {
  let content = fs.readFileSync(file, "utf8");
  let modified = false;

  content = content.replace(importRegex, (match, importPath) => {
    if (/\.[a-z]+$/i.test(importPath)) return match; // already has extension
    modified = true;
    return `from "${importPath}.js"`;
  });

  if (modified) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`✔ Fixed imports in: ${path.relative(process.cwd(), file)}`);
    fixedCount++;
  }
}

console.log(`\nFinished. Updated ${fixedCount} files.`);
