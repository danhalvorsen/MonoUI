# MonoUI Monorepo Architecture Documentation

## Core Principles

1. **Independent Modules**
   - Each package is a standalone unit that can be published independently
   - No shared dependencies in root node_modules
   - Each package manages its own dependencies and build configuration

2. **Package Structure**
   ```
   package/
   ├── src/              # Source code
   ├── dist/             # Build output
   ├── package.json      # Package configuration
   └── tsconfig.json     # TypeScript configuration
   ```

3. **Build Process**
   - Each package has its own build script
   - Root scripts coordinate builds but don't enforce them
   - TypeScript compilation is handled per-package

## Key Architecture Decisions

### Dependency Management
1. **Package-level Dependencies**
   - Dependencies must be declared in their respective package.json
   - Root package.json contains only monorepo-wide devDependencies
   - No shared dependencies between packages
   - Each package manages its own Lit dependencies

2. **Build System**
   - Vite for app builds
   - TypeScript compilation per package
   - No root tsconfig.json - each package has its own
   - Use npm workspaces for package management
   - **Module System**: ES modules (ESNext) with Node.js resolution
   - **Key Module Settings**:
     - `module: ESNext` in tsconfig.json
     - `moduleResolution: Node`
     - `target: ES2021`
     - `esModuleInterop: true`

### Package Structure
1. **Packages**
   - `mr-slider`: Lit 3 slider component
   - `mr-basic`: Basic Lit components
   - `mr-style`: Token-based design system
     - Contains CSS tokens and design system variables
     - No build step required - just a collection of design tokens
     - Used by other packages for consistent styling
   - Each package follows the same structure:
     ```
     package/
     ├── src/              # Source code
     ├── dist/             # Build output
     ├── package.json      # Package configuration
     └── tsconfig.json     # TypeScript configuration
     ```

2. **Apps**
   - `basic-slider-demo`: Demo application
   - Each app has its own vite.config.ts
   - Apps import packages using aliases
   - Apps maintain their own dependencies

## Development Guidelines

1. **Adding New Packages**
   - Create new directory under packages/
   - Initialize with package.json and tsconfig.json
   - Add necessary dependencies
   - Implement build script
   - **Important Module Settings**:
     - In package.json:
       ```json
       {
         "type": "module",
         "main": "dist/index.js",
         "types": "dist/index.d.ts"
       }
       ```
     - In tsconfig.json:
       ```json
       {
         "compilerOptions": {
           "module": "ESNext",
           "moduleResolution": "Node",
           "target": "ES2021",
           "esModuleInterop": true
         }
       }
       ```

2. **Adding New Apps**
   - Create new directory under apps/
   - Initialize with package.json
   - Configure vite.config.ts
   - Add package dependencies using workspace:* syntax

3. **Building**
   - Use npm run build:all for entire monorepo
   - Use npm run build:apps for just the demo apps
   - Each package can be built independently

4. **Linting**
   - Each package has its own linting configuration
   - Root scripts can run linting across all packages
   - Use consistent TypeScript and ESLint rules

## Common Issues and Solutions

1. **Dependency Resolution**
   - Always install dependencies in the package directory
   - Never use root node_modules for package dependencies
   - Use workspace:* for local package dependencies
   - **Module System Issues**:
     - Never use CommonJS syntax (`require()`, `module.exports`)
     - Always use ES module syntax (`import`, `export`)
     - Ensure `"type": "module"` in package.json
     - Use correct file extensions (.mjs or .js with "type": "module")

2. **Build Issues**
   - Clean builds with npm run clean
   - Check each package's tsconfig.json
   - Verify package.json scripts are correct

3. **TypeScript Configuration**
   - Each package has its own tsconfig.json
   - No root tsconfig.json to avoid conflicts
   - Use consistent TypeScript settings across packages
   - Dependencies should be declared in their respective package.json

2. **Apps**
   - Each app has its own package.json
   - Only declare direct dependencies
   - Use relative paths for local packages

### Common Issues and Solutions

1. **Build Errors**
   - Ensure Lit dependencies are declared in the correct package
   - Avoid declaring Lit in root package.json
   - Use correct path aliases in vite.config.ts
   - Ensure consistent module format (ESM) throughout the build chain

2. **Module Resolution**
   - All packages must use ESM ("type": "module")
   - Vite configuration must specify ESM output format
   - Use proper path aliases for local package imports
   - Avoid mixing CommonJS and ESM imports
   - In Lit 3, decorators are part of the core package but need proper aliasing
   - Vite configuration should use `conditions: ['esm']` to ensure ESM resolution
   - Do not use `external` for ESM modules unless absolutely necessary

3. **Development Setup**
   - Run `npm install` at root level first
   - Use `npx lerna bootstrap` for package linking
   - Run `npm run build:all` for full monorepo build

4. **Linting**
   - Use ESLint flat config
   - Keep ESLint plugins in root package.json
   - Each package can extend root ESLint config

### Best Practices

1. **Package Management**
   ```json
   // Example package.json structure
   {
     "name": "package-name",
     "version": "0.1.0",
     "dependencies": {
       "lit": "^3.3.0"  // Only in packages that use Lit
     },
     "devDependencies": {
       "@typescript-eslint/eslint-plugin": "^8.37.0"  // Package-specific dev deps
     }
   }
   ```

2. **Vite Configuration**
   ```typescript
   // Example vite.config.ts
   export default defineConfig({
     resolve: {
       alias: {
         'mr-slider': path.resolve(__dirname, '../../packages/mr-slider/dist/mr-slider.js'),
         'lit': path.resolve(__dirname, '../../node_modules/lit')
       }
     }
   });
   ```

3. **Build Process**
   - Always build packages first
   - Then build apps that depend on those packages
   - Use monorepo-wide scripts from root package.json

### Troubleshooting Guide

1. **Common Build Errors**
   - "Could not load Lit decorators":
     - Check if Lit is declared in the correct package
     - Verify vite.config.ts aliases
     - Ensure package builds before app build

2. **Dependency Resolution**
   - If you need to add a new dependency:
     1. Add to the specific package's package.json
     2. Run `npm install` in that package
     3. Run `npm run build:all` to rebuild

3. **Development Workflow**
   ```bash
   # Initial setup
   npm install
   npx lerna bootstrap
   
   # Building
   npm run build:all  # Build everything
   npm run build      # Build specific package/app
   ```

This documentation is meant to help maintain consistency across the monorepo and prevent common issues. When making changes, always refer back to these guidelines to ensure architectural consistency.
