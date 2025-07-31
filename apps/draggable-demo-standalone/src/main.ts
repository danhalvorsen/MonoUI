import { DemoApplication } from './DemoApplication.js';

/**
 * Entry point for the draggable demo application
 * 
 * This implementation follows SOLID principles:
 * - Single Responsibility: Each class has one clear purpose
 * - Open/Closed: Easy to extend with new features without modifying existing code
 * - Liskov Substitution: Interfaces can be substituted with implementations
 * - Interface Segregation: Small, focused interfaces
 * - Dependency Inversion: Depends on abstractions, not concretions
 * 
 * DRY principles are applied through:
 * - Factory pattern for object creation
 * - Configuration centralization
 * - Service extraction for reusable functionality
 */

// Initialize and start the demo application
const demoApp = new DemoApplication('canvas');

// Export for potential external access (testing, debugging, etc.)
(window as any).demoApp = demoApp;
