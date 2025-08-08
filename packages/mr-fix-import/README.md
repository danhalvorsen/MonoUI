# fix-imports

A small TypeScript CLI to index exports and fix relative import paths after you move files/folders.

## Install
```bash
pnpm i
pnpm build
```

## Preview changes
```bash
node dist/index.js --root . --add-js-extension
```

## Apply changes
```bash
node dist/index.js --root . --add-js-extension --write
```
