import { vi } from 'vitest';

// Mock console methods to avoid spam during tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

// Mock DOM APIs that might not be available in jsdom
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 16); // ~60fps
  return 1;
});

global.cancelAnimationFrame = vi.fn();

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
  },
});

// Mock HTMLCanvasElement methods
const mockContext = {
  canvas: {} as HTMLCanvasElement,
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  createImageData: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  resetTransform: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  arc: vi.fn(),
  arcTo: vi.fn(),
  ellipse: vi.fn(),
  rect: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  clip: vi.fn(),
  isPointInPath: vi.fn(),
  isPointInStroke: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  createLinearGradient: vi.fn(),
  createRadialGradient: vi.fn(),
  createPattern: vi.fn(),
  getLineDash: vi.fn(() => []),
  setLineDash: vi.fn(),
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
  strokeStyle: '#000000',
  fillStyle: '#000000',
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter',
  miterLimit: 10,
  lineDashOffset: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowColor: 'rgba(0, 0, 0, 0)',
  font: '10px sans-serif',
  textAlign: 'start',
  textBaseline: 'alphabetic',
  direction: 'ltr',
  imageSmoothingEnabled: true,
};

HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
  if (contextId === '2d') {
    return mockContext as unknown as CanvasRenderingContext2D;
  }
  return null;
}) as any;

HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,');
HTMLCanvasElement.prototype.toBlob = vi.fn();

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 800,
  x: 0,
  y: 0,
  toJSON: vi.fn(),
}));

// Setup custom element registry mock
class MockCustomElementRegistry {
  private elements = new Map();
  
  define(name: string, constructor: any, options?: any) {
    this.elements.set(name, { constructor, options });
  }
  
  get(name: string) {
    return this.elements.get(name)?.constructor;
  }
  
  whenDefined(name: string) {
    return Promise.resolve();
  }
}

Object.defineProperty(window, 'customElements', {
  writable: true,
  value: new MockCustomElementRegistry(),
});

// Export types for test files
export type MockedFunction<T extends (...args: any[]) => any> = T & {
  mock: {
    calls: Parameters<T>[];
    results: { type: 'return' | 'throw'; value: ReturnType<T> }[];
  };
};
