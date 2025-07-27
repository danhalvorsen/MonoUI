# Shared Vite Config for Node CLI Packages

This folder contains **shared Vite configurations** used by all Node-targeted CLI packages in the monorepo (e.g., `cli-core`, `cli-core-plugin-create-package-module`, `cli-types`).

The goal is to:

- **Standardize builds** across all CLI packages.
- **Reduce duplication** by centralizing Vite settings.
- **Automatically externalize dependencies** (no need to manually list them).
- **Target Node 20** with modern ESM builds.

---

## vite.node.lib.ts

### Overview

`vite.node.lib.ts` exports a helper function `createNodeLibConfig(entry: string)` that generates a **production-ready Vite config** for building Node libraries and CLI tools.

### Features

- **Automatic externalization** of:
  - All `dependencies` and `peerDependencies` from the current `package.json`.
  - All Node built-ins (e.g., `fs`, `path`, `crypto`).
- **TypeScript declarations** using [`vite-plugin-dts`](https://www.npmjs.com/package/vite-plugin-dts).
- **ESM output** targeting Node 20.
- **Single entry point** (by default `src/index.ts`).

---

### Usage in a package

#### 1. Import the shared config in your package's `vite.config.ts`

```ts
// File: packages/my-cli/vite.config.ts
import { createNodeLibConfig } from "../../configs/vite.node.lib";
export default createNodeLibConfig("src/index.ts");
