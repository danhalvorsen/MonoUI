// Test setup file for Vitest
import { beforeEach, vi } from 'vitest';

// Mock console methods to reduce noise in tests
beforeEach(() => {
  // Suppress console.log in tests unless needed
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

// Global test utilities can be added here
declare global {
  interface Window {
    // Add any global test utilities here
  }
}

export {};
