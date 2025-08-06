# Barrel Generator System Design & Architecture

## Overview

The Barrel Generator is a modular, extensible TypeScript code generation engine for creating and maintaining barrel files (e.g., `index.ts`) in monorepos or package-based projects. It is designed for flexibility, testability, and easy extension using the Strategy Pattern.

## Key Concepts

- **Strategy Pattern**: The system is built around interfaces for each major responsibility (content generation, file discovery, file writing). This allows you to swap or extend behaviors without changing the core engine.
- **ts-morph Integration**: All TypeScript file creation and manipulation is handled via [ts-morph](https://ts-morph.com/), ensuring correct formatting and AST-level safety.
- **Dry Run Support**: The engine can simulate file generation without writing to disk, making it safe for CI and developer preview.
- **CLI and API**: The system is designed to be used both as a CLI tool and as a programmatic API.

## Architecture Diagram

```
+-------------------+
|   BarrelService   |
+-------------------+
| - generator       |
| - discoverer      |
| - writer          |
| - project         |
+-------------------+
         | uses
         v
+-------------------+      +-------------------+      +-------------------+
| IBarrelContentGen |      | IBarrelFileDiscov |      | IBarrelFileWriter |
+-------------------+      +-------------------+      +-------------------+
| Default impl:     |      | Default impl:     |      | Default impl:     |
| BarrelContentGen  |      | BarrelFileDiscov  |      | BarrelFileWriter  |
+-------------------+      +-------------------+      +-------------------+
```

## Main Components

### 1. BarrelService

- Orchestrates the process: discovers files, generates content, writes barrels.
- Accepts strategies for each responsibility via constructor options.
- Uses `ts-morph` for all TypeScript file writes.

### 2. Content Generation (Strategy)

- **Interface:** `IBarrelContentGenerator`
- **Default:** `DefaultBarrelContentGenerator`
- Generates the content for a barrel file (e.g., `export * from ...`).
- Supports options for export style, type-only exports, exclusions, etc.

### 3. File Discovery (Strategy)

- **Interface:** `IBarrelFileDiscoverer`
- **Default:** `DefaultBarrelFileDiscoverer`
- Discovers which files should be included in the barrel for a given directory.
- Can be customized for different file patterns or filtering logic.

### 4. File Writing (Strategy)

- **Interface:** `IBarrelFileWriter`
- **Default:** `DefaultBarrelFileWriter`
- Handles writing (and removing) barrel files using `ts-morph`.
- Can be swapped for custom output (e.g., logging, remote storage).

## Extending the System

To add a new strategy (e.g., a custom content generator):

1. Implement the relevant interface (e.g., `IBarrelContentGenerator`).
2. Pass your implementation to `BarrelService` via the options object.

```ts
import { BarrelService } from './BarrelService.js';
import { MyCustomContentGenerator } from './content/MyCustomContentGenerator.js';

const service = new BarrelService({
  rootDir: 'src',
  contentGenerator: new MyCustomContentGenerator(...)
});
service.run();
```

## Example Usage

```ts
import { BarrelService } from './BarrelService.js';

const service = new BarrelService({
  rootDir: 'packages',
  dryRun: true,
  barrelName: 'index.ts',
  // ...other options
});
service.run();
```

## Design Benefits

- **Testable:** Each part can be tested in isolation.
- **Extensible:** Add new strategies without changing the core.
- **Safe:** Uses `ts-morph` for all TypeScript file writes.
- **Flexible:** CLI and API usage, dry-run support, and more.

---

For more details, see the code in the `src/` folder and the interfaces in `src/content/`, `src/discovery/`, and `src/writing/`.
