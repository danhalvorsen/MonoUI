import { parse } from '@babel/parser';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface PackageDependencies {
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

export class PackageReferenceValidator {
  private readonly packagesDir: string;
  private readonly packageDependencies: Record<string, PackageDependencies>;

  constructor(packagesDir: string) {
    this.packagesDir = packagesDir;
    this.packageDependencies = this.loadPackageDependencies();
  }

  private loadPackageDependencies(): Record<string, PackageDependencies> {
    const packages = this.getPackageNames();
    const dependencies: Record<string, PackageDependencies> = {};

    for (const pkg of packages) {
      const pkgJsonPath = path.join(this.packagesDir, pkg, 'package.json');
      try {
        const fileContent = fs.readFileSync(pkgJsonPath, 'utf-8');
        if (!fileContent.trim()) {
          console.error(`Error: Empty package.json found for ${pkg}`);
          process.exit(1);
        }
        const pkgJson = JSON.parse(fileContent);
        dependencies[pkg] = {
          dependencies: pkgJson.dependencies || {},
          peerDependencies: pkgJson.peerDependencies || {}
        };
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error(`Error parsing package.json for ${pkg}: Invalid JSON`);
        } else {
          console.error(`Error reading package.json for ${pkg}:`, error);
        }
        process.exit(1);
      }
    }

    return dependencies;
  }

  private getPackageNames(): string[] {
    try {
      if (!fs.existsSync(this.packagesDir)) {
        console.error(`Error: Packages directory not found at ${this.packagesDir}`);
        process.exit(1);
      }
      
      const dirs = fs.readdirSync(this.packagesDir);
      return dirs.filter(dir => {
        try {
          const fullPath = path.join(this.packagesDir, dir);
          const isDir = fs.statSync(fullPath).isDirectory();
          const hasPackageJson = fs.existsSync(path.join(fullPath, 'package.json'));
          
          if (isDir && !hasPackageJson) {
            console.warn(`Warning: Directory ${dir} has no package.json and will be skipped`);
          }
          
          return isDir && hasPackageJson;
        } catch (err) {
          console.warn(`Warning: Error checking directory ${dir}:`, err);
          return false;
        }
      });
    } catch (error) {
      console.error('Error reading packages directory:', error);
      process.exit(1);
    }
  }

  public validateReferences(): void {
    const packages = this.getPackageNames();

    for (const pkg of packages) {
      const srcDir = path.join(this.packagesDir, pkg, 'src');
      if (!fs.existsSync(srcDir)) {
        console.log(`Skipping ${pkg}: No src directory found`);
        continue;
      }

      try {
        const files = glob.sync('**/*.ts', { cwd: srcDir });
        for (const file of files) {
          const filePath = path.join(srcDir, file);
          this.checkImportsInFile(filePath, pkg);
        }
      } catch (error) {
        console.error(`Error processing ${pkg}:`, error);
        process.exit(1);
      }
    }
  }

  private checkImportsInFile(filePath: string, packageName: string): void {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const ast = parse(fileContent, {
        sourceType: 'module',
        plugins: ['typescript', 'importMeta']
      });

      const imports = ast.program.body
        .filter(node => node.type === 'ImportDeclaration' || node.type === 'ExportNamedDeclaration')
        .flatMap(node => {
          if (node.source) {
            return [node.source.value];
          }
          return [];
        });

      for (const importPath of imports) {
        if (this.shouldSkipImport(importPath)) continue;

        this.validatePackageImport(importPath, packageName, filePath);
      }
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      process.exit(1);
    }
  }

  private shouldSkipImport(importPath: string): boolean {
    // Skip relative imports and node_modules imports
    if (importPath.startsWith('.') || importPath.startsWith('node_modules')) {
      return true;
    }
    
    // Skip absolute imports that use path aliases (must be configured in tsconfig.json)
    if (!importPath.startsWith('.')) {
      const pkgNames = this.getPackageNames();
      return pkgNames.some(pkg => importPath.startsWith(`${pkg}/`));
    }

    return false;
  }

  private validatePackageImport(importPath: string, packageName: string, filePath: string): void {
    const packageNameInImport = importPath.split('/')[0];
    if (this.getPackageNames().includes(packageNameInImport)) {
      const dependencies = this.packageDependencies[packageName];
      if (!dependencies.dependencies[packageNameInImport] && !dependencies.peerDependencies[packageNameInImport]) {
        console.error(`Error: Package ${packageName} references ${packageNameInImport} without declaring it as a dependency`);
        console.error(`File: ${filePath}`);
        console.error(`Import: ${importPath}`);
        process.exit(1);
      }
    }
  }
}

// Run validation
try {
  const validator = new PackageReferenceValidator(path.join(__dirname, '..', 'packages'));
  validator.validateReferences();
} catch (error) {
  console.error('Validation failed:', error);
  process.exit(1);
}
