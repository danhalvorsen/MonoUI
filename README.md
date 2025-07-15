# MonoUI - Monorepo for UI Components

## Project Structure

This is a monorepo containing multiple independent packages and applications. The structure is as follows:

```
mono-ui/
├── apps/              # Demo applications
│   └── basic-slider-demo/
├── packages/          # Reusable UI components
│   ├── mr-slider/    # Lit-based slider component
│   ├── mr-basic/     # Basic UI components
│   └── mr-style/     # Token-based design system
└── scripts/          # Build and utility scripts
```

## Key Features

1. **Independent Modules**
   - Each package is self-contained with its own dependencies
   - No shared dependencies in root node_modules
   - Each package can be published independently
   - Uses ES modules (ESNext) with TypeScript support

2. **Monorepo Management**
   - Root package.json manages workspace-wide operations
   - Shared scripts for building all packages and apps
   - Consistent TypeScript configuration across all modules
   - PowerShell-based build scripts for Windows compatibility

## Available Scripts

```bash
# Build all packages and apps
npm run build:all

# Build all demo apps
npm run build:apps

# Clean all node_modules and package-lock.json
npm run clean

# Lint all packages and apps
npm run lint

# Fix linting issues
npm run lint:fix
```

## Using the Design System (mr-style)

The `mr-style` package contains a token-based design system that can be reused across other packages and applications. Here's how to use it:

1. **Install as a dependency**
```bash
npm install mr-style
```

2. **Importing Tokens**
You can import tokens in several ways:

- Individual token imports:
```typescript
import { colorTokens } from 'mr-style/tokens/color';
import { spacingTokens } from 'mr-style/tokens/spacing';
```

- Theme imports:
```typescript
import { darkTheme } from 'mr-style/themes/dark';
import { lightTheme } from 'mr-style/themes/light';
```

- Module imports:
```typescript
import { hourRect } from 'mr-style/modules/hour-rect';
```

- Bulk import:
```typescript
import * as style from 'mr-style';
// Now you can access all tokens and themes
```

3. **Available Token Categories**
- Colors
- Sizes
- Spacing
- Flex
- Animation
- Border
- Shadow
- Z-index

4. **Available Themes**
- Dark
- Light
- Contrast

The design system is fully typed and supports tree-shaking, so only the tokens you actually use will be included in your final bundle.

## Building the Monorepo

The monorepo uses PowerShell scripts for building and maintenance. The main build script is located at `scripts/build-simplified.ps1`.

```bash
# Build all packages and apps
npm run build:all

# Build individual packages
npm run build --workspace=mr-slider
npm run build --workspace=mr-basic
npm run build --workspace=mr-style

# Build demo apps
npm run build:apps
```

1. Clean and rebuild:
```bash
# Clean all dependencies
npm run clean:all

# Reinstall dependencies
npm install

# Build again
npm run build:all
```

2. If Lit-related errors occur (e.g., decorator issues):
```bash
# Clean node_modules
npm run clean:node

# Reinstall Lit dependencies
npm install lit @lit/reactive-element

# Build again
npm run build:all
```

3. Check Vite configuration:
- Ensure all Lit dependencies are properly aliased
- Verify rollupOptions.external includes Lit decorators
- Check that all package paths are correctly resolved

For more detailed build options, see the [Build-All.ps1](./scripts/Build-All.ps1) script.

## Update Dependencies

To update dependencies across the monorepo, use these scripts:

```bash
# Update all dependencies
npm run update:all

# Update only package dependencies
npm run update:packages

# Update only app dependencies
npm run update:apps
```

### Clean and Reinstall Dependencies

If you need to clean and reinstall dependencies:

```bash
# Clean and reinstall all dependencies
npm run clean:all

# Clean only specific dependencies
npm run clean:eslint  # Clean ESLint dependencies
npm run clean:node   # Clean all node_modules
```

## Linting

This project uses ESLint for code linting to maintain code quality and consistency across the monorepo. The linting setup is configured to work with TypeScript and Lit 3 components.

### Available Linting Scripts

The following npm scripts are available for linting:

```bash
# Lint the entire project
npm run lint

# Lint and fix issues automatically
npm run lint:fix

# Strict linting with no warnings allowed
npm run lint:check

# Lint only apps directory
npm run lint:apps

# Lint only packages directory
npm run lint:packages

# Lint everything (root + apps + packages)
npm run lint:all

# Clean and reinstall ESLint dependencies
npm run clean-eslint
```

### Setting Up Linting

1. Ensure all dependencies are installed:
```bash
npm install
```

2. Each package in the monorepo should have its own `.eslintrc.json` file. If needed, you can generate one using the script:
```bash
npx eslint --init
```

3. The root ESLint configuration extends the Lit plugin and TypeScript ESLint plugin for best practices.

### Fixing Linting Issues

When running `npm run lint`, you might see different types of issues:

- ✖ Errors: Must be fixed before committing
- ⚠ Warnings: Recommendations that should be addressed

To automatically fix fixable issues:
```bash
npm run lint:fix
```

### Common Linting Rules

The project uses a combination of:
- ESLint core rules
- TypeScript ESLint plugin
- Lit plugin
- Lit A11Y plugin

Key rules include:
- Template literal syntax checking
- TypeScript type checking
- Lit component best practices
- Accessibility checks

### Troubleshooting

If you encounter ESLint errors about missing dependencies:
1. Run the clean and reinstall script:
```bash
npm run clean-eslint
```
2. Reinstall dependencies:
```bash
npm install
```
