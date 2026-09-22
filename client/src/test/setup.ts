import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Full in-memory localStorage mock
// ---------------------------------------------------------------------------
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};

  const mock = {
    getItem(key: string): string | null {
      return Object.prototype.hasOwnProperty.call(store, key) ? (store[key] ?? null) : null;
    },
    setItem(key: string, value: string): void {
      store[key] = value;
    },
    removeItem(key: string): void {
      delete store[key];
    },
    clear(): void {
      store = {};
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key(index: number): string | null {
      const keys = Object.keys(store);
      return index >= 0 && index < keys.length ? (keys[index] ?? null) : null;
    },
  };

  return mock;
};

Object.defineProperty(global, 'localStorage', {
  value: createLocalStorageMock(),
  writable: true,
});

// ---------------------------------------------------------------------------
// Test lifecycle hooks
// ---------------------------------------------------------------------------
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

// Made with Bob
