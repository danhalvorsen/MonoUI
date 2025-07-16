# MonoUI Scripts

This directory contains various PowerShell scripts used for building and maintaining the MonoUI monorepo.

## Available Scripts

### Build Scripts
- `build-workspaces.ps1` - Main build script that handles:
  - Installing dependencies
  - Validating package references
  - Building all workspaces
  - Supports `--apps` flag to build only apps
  
### Cleanup Scripts
- `cleanup.ps1` - Cleans up:
  - All `node_modules` directories
  - All `package-lock.json` files
- `cleanup-eslint.ps1` - Specific cleanup for ESLint configurations

### Linting Scripts
- `lint-all.ps1` - Runs ESLint across all packages and apps
- `fix-eslint-config.ps1` - Fixes ESLint configuration issues

### Dependency Management
- `install-dependencies.ps1` - Handles dependency installation across workspaces

### Reference Validation
- `rule-references.ts` - TypeScript script that validates package references across the monorepo

## Usage

All scripts can be run from the root of the repository using npm scripts:

```bash
# Build all workspaces
npm run build

# Build only apps
npm run build:apps

# Clean up
npm run clean

# Lint
npm run lint

# Fix lint issues
npm run lint:fix

# Validate package references
npm run validate-references
```
