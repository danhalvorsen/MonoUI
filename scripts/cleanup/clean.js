#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix base path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.resolve(__dirname, '..');

const workspaces = process.argv.slice(2);
if (workspaces.length === 0) {
  workspaces.push('mr-abstract-components');
}

const report = [];

for (const workspace of workspaces) {
  const targetDir = path.join(basePath, workspace);
  console.log(`Cleaning build artifacts in ${targetDir}...`);
  const workspaceReport = { workspace, deleted: [] };

  // Remove dist folder
  const distPath = path.join(targetDir, 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    workspaceReport.deleted.push(distPath);
  }

  // Remove compiled JS, map, and declaration files from src
  const srcPath = path.join(targetDir, 'src');
  if (fs.existsSync(srcPath)) {
    const removeCompiled = (dir) => {
      for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          removeCompiled(fullPath);
        } else if (/\.(js|map|d\.ts)$/.test(file)) {
          fs.rmSync(fullPath, { force: true });
          workspaceReport.deleted.push(fullPath);
        }
      }
    };
    removeCompiled(srcPath);
  }

  report.push(workspaceReport);
  console.log(`Cleanup complete for workspace: ${workspace}.`);
}

// Output report to screen in a pretty format
console.log('\n=== Cleanup Report ===');
for (const r of report) {
  console.log(`Workspace: ${r.workspace}`);
  console.log(`Deleted items: ${r.deleted.length}`);
  r.deleted.slice(0, 10).forEach((f) => console.log(`  - ${f}`));
  if (r.deleted.length > 10) {
    console.log(`  ...and ${r.deleted.length - 10} more`);
  }
  console.log('');
}
