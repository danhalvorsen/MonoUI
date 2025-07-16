# mr-style-cli

A command-line tool for generating TypeScript service classes from mr-style design tokens.

## Features

- Generates injectable TypeScript services from design tokens
- Supports all token categories (color, spacing, etc.)
- Maintains proper TypeScript types and interfaces
- Easy to use CLI interface

## Installation

```bash
# Install globally
npm install -g mr-style-cli

# Or install locally
npm install mr-style-cli
```

## Usage

```bash
# Generate a service for color tokens
mr-style-cli color ./src/services

# Generate a service for spacing tokens
mr-style-cli spacing ./src/services

# Usage with npm script
npx mr-style-cli color ./src/services
```

## Generated Output

The CLI generates TypeScript service classes that:

1. Are decorated with `@injectable()` for dependency injection
2. Implement the corresponding token interface
3. Include all token values as class properties
4. Are properly typed and ready to use

Example generated service:

```typescript
import { injectable } from 'tsyringe';
import type { IColorTokens } from '../../contracts/IColorTokens';

@injectable()
export class ColorTokenService implements IColorTokens {
  primary = '#007bff';
  secondary = '#6c757d';
  // ... other token values
}
```

## Requirements

- Node.js 16+
- TypeScript 5+
- mr-style package (peer dependency)

## Installation

```bash
# Install globally with mr-style
npm install -g mr-style-cli mr-style

# Or install locally
npm install mr-style-cli mr-style
```
