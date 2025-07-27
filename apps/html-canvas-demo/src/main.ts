import 'reflect-metadata';
import { container } from 'tsyringe';
import { CanvasSelectionBehavior } from '../../../packages/mr-web-components/src/visualObjects/CanvasSelectionBehavior.js';
import { Rectangle } from '../../../packages/mr-web-components/src/visualObjects/rectangle.js';
import '../../../packages/mr-web-components/src/engine/CanvasEngineElement.js';

// Register selection behavior
container.register('ISelectionBehavior', { useClass: CanvasSelectionBehavior });

// Example: resolve Rectangle with DI
// const rect = container.resolve(Rectangle);
