# mr-basic

This package is a simple example of a Lit web component using IoC via [tsyringe](https://www.npmjs.com/package/tsyringe).

## Building

Install the package dependencies and run the TypeScript compiler:

```bash
pnpm install
pnpm run build
```

Running `pnpm run build` before installing dependencies can lead to errors such as:

```
Cannot find module 'tsyringe' or its corresponding type declarations
```

Installing dependencies resolves this issue by providing the module and type declarations.

