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

## Improvements

Here’s a **clear strategy** for splitting up `mr-style-cli` into **reusable, SRP‑compliant modules** so it can grow and be reused by other apps or tooling:

---

## **1. Why Split It?**

Currently, `mr-style-cli` mixes:

- **CLI argument parsing**
- **Token file parsing (AST via ts-morph)**
- **Service class generation**
- **Filesystem operations**
- **Build-time packaging**

Splitting by **Single Responsibility Principle (SRP)** gives:

- **Reusability** – other tools can use the same core logic without invoking the CLI.
- **Testability** – unit tests can target individual modules.
- **Extensibility** – easy to add more generators (CSS vars, SCSS, JSON outputs).

---

## **2. Suggested Architecture**

### **a) Core Token Parsing**

Responsible for loading and parsing token files (using `ts-morph` or a simpler AST).

**Module:** `token-parser`
**Responsibilities:**

- Read TypeScript token definitions (`*.tokens.ts`).
- Return a normalized object representation of tokens.

**Reusable in:**

- Web UI token editors
- Styleguide generators

---

### **b) Service Generator**

Responsible for generating injectable services (`ColorTokensService`, etc.).

**Module:** `service-generator`
**Responsibilities:**

- Take parsed tokens and generate TypeScript service classes.
- Optionally add decorators (`@injectable`) and implement interfaces.

**Reusable in:**

- Any DI-based app needing tokens as services (NestJS, web apps, etc.).

---

### **c) Output Writers**

Handles writing generated files to disk (filesystem only).

**Module:** `output-writer`
**Responsibilities:**

- Ensure output directory exists.
- Write generated files with proper formatting.

**Reusable in:**

- Any CLI or build tool that generates files.

---

### **d) CLI Layer**

Thin wrapper around the above modules.

**Module:** `cli`
**Responsibilities:**

- Parse CLI arguments.
- Call parser → generator → writer in sequence.
- Handle errors, logging, exit codes.

**Reusable in:**

- Node CLI binaries.

---

### **e) Build Scripts**

Keeps the "distribution packaging" separate from CLI execution.

**Module:** `build-tools`
**Responsibilities:**

- Prepare `dist` (copy bin, clean package.json).
- Possibly generate additional outputs (e.g., JSON export of tokens).

**Reusable in:**

- Any npm package needing clean dist builds.

---

## **3. Example Folder Structure**

```
packages/mr-style-cli/
├─ src/
│  ├─ cli/                # CLI entrypoint
│  │   └─ main.ts
│  ├─ core/
│  │   ├─ token-parser.ts
│  │   ├─ service-generator.ts
│  │   └─ output-writer.ts
│  └─ utils/
│      └─ logger.ts
├─ scripts/
│   └─ build.ts           # Distribution packaging
```

---

## **4. Benefits**

- **Loose coupling** – Each module can evolve independently.
- **Testable** – Unit test `token-parser` without touching CLI.
- **Reusable** – Other projects (design systems, static site generators) can use `service-generator` directly.
- **Extensible** – Easily add new generators (e.g., CSS variables, JSON tokens).

---

**Next Step:**
Do you want me to **draft a refactored folder structure with TypeScript code stubs** for each module (parser, generator, writer, CLI)?
Or even **create a ready-to-run multi-module Vite project** for `mr-style-cli`?

Would you prefer a **monolithic package** with submodules (`import { TokenParser } from 'mr-style-cli/core'`) or **split into separate npm packages** (e.g., `@mr/style-token-parser`, `@mr/style-generator`)?
