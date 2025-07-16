# MonoUI Monorepo - Architecture and Development Guide

## Core Architecture Principles

1. **Package Independence**
   - Each package is a standalone unit with its own:
     - Dependencies (in package.json)
     - Build configuration
     - Test suite
     - Documentation
   - No shared dependencies in root node_modules
   - Clear boundaries between packages

2. **Package Structure**
   ```
   package/
   ├── src/              # TypeScript source files
   │   └── index.ts      # Main entry point
   ├── dist/             # Compiled JavaScript (generated)
   ├── scripts/          # Build and utility scripts
   │   └── build.ts      # TypeScript build script
   ├── package.json      # Package configuration
   ├── tsconfig.json    # TypeScript configuration
   └── README.md        # Package documentation
   ```

3. **Build System**
   - TypeScript compilation with strict type checking
   - Source maps for debugging
   - Clean separation between source and compiled files
   - Automated build process with proper output directory structure

## Technical Implementation Details

### Build System Configuration

1. **TypeScript Configuration**
   - Each package has its own `tsconfig.json`
   - Common configuration extends from root `tsconfig.base.json`
   - Key compiler options:
     ```json
     {
       "module": "NodeNext",
       "moduleResolution": "NodeNext",
       "target": "ES2022",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true
     }
     ```

2. **Build Process**
   - Clean build directory
   - TypeScript compilation
   - Copy non-TypeScript assets
   - Generate type definitions
   - Set file permissions (for CLI tools)

3. **Development Workflow**
   - Watch mode for development
   - Source maps for debugging
   - Hot module replacement (HMR) for apps
   - Linting and type checking in watch mode

## Package Architecture

### Core Packages

1. **mr-style-cli**
   - **Purpose**: Command-line tool for generating token services
   - **Key Features**:
     - Generates TypeScript services from design tokens
     - Supports custom token formats
     - Integrates with the design system
   - **Build Process**:
     - Compiles TypeScript to ESM
     - Generates type definitions
     - Creates executable CLI entry points

2. **mr-style**
   - **Purpose**: Token-based design system
   - **Key Features**:
     - Centralized design tokens
     - Theme management
     - Responsive design utilities

3. **mr-slider**
   - **Purpose**: Accessible, customizable slider component
   - **Features**:
     - Built with Lit 3
     - Fully keyboard navigable
     - Customizable styling

4. **mr-basic**
   - **Purpose**: Collection of foundational UI components
   - **Features**:
     - Button
     - Input
     - Card
     - Other basic UI elements
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

## Development Guidelines

### Module Resolution
- All packages use ES modules (`"type": "module"` in package.json)
- Import paths must be explicit (use file extensions)
- Use path aliases defined in tsconfig.json
- Avoid mixing CommonJS and ESM imports

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for consistent formatting
- Document public APIs with JSDoc
- Write unit tests for all non-trivial functionality

### Testing Strategy
- Unit tests with Vitest
- Component tests with Web Test Runner
- Integration tests for critical paths
- Visual regression testing for UI components

## CI/CD Pipeline

### Build Process
1. Install dependencies
2. Lint and type check
3. Run tests
4. Build all packages
5. Generate documentation
6. Publish packages (on release)

### Versioning
- Semantic Versioning (SemVer)
- Changesets for version management
- Automated changelog generation

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Ensure all imports include file extensions
   - Check tsconfig.json paths and baseUrl
   - Verify package.json exports

2. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Clean build directory and node_modules/.cache

3. **Type Errors**
   - Ensure types are properly exported
   - Check for circular dependencies
   - Update type definitions when API changes
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
