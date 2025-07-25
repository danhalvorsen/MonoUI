{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "composite": true,
    "noEmit": false,
    "module": "ESNext",
    "target": "ES2021",
    "types": ["node"],
    "paths": {
      "@/*": ["./src/*"],
      "@tests/*": ["./tests/*"]
    }
  },
  "include": ["src/**/*", "tests/**/*"]
}
