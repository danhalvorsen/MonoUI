import 'reflect-metadata';
import { container } from 'tsyringe';
import { CanvasSelectionBehavior, Rectangle } from 'mr-web-components';
import 'mr-web-components';

// Register selection behavior
container.register('ISelectionBehavior', { useClass: CanvasSelectionBehavior });

// Example: resolve Rectangle with DI
// const rect = container.resolve(Rectangle);
