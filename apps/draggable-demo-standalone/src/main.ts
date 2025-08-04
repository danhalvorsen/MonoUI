
import { DraggableDemoApp } from './DraggableDemoApp.js';
 
// Initialize and start the demo application
const demoApp = new DraggableDemoApp();

// Export for potential external access (testing, debugging, etc.)
(window as any).demoApp = demoApp;
