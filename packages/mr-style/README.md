# mr-style

A modular design token system for scalable theming, styling, and component consistency.

## Features
- Token categories: color, size, spacing, animation, shadow, border, z-index, icons
- Theme system: dark, light, contrast
- Responsive design breakpoints
- CLI for token generation, validation, and preview
- Build step for CSS variable export

## Usage
```ts
import { hourRectStyles } from 'mr-style/modules/hour-rect.style.js';
```

## Theming
Use `LightTheme`, `DarkTheme`, or create your own. Inject into your component system or CSS variable generator.

## CLI
```bash
npx mr-style-cli generate-token --name spacing
npx mr-style-cli validate
npx mr-style-cli build-css
```

## Documentation Site (planned)
- Token Explorer
- Theme Previewer
- Accessibility Testing