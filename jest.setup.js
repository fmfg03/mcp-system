// Jest setup file
require('@testing-library/jest-dom');

// Mock for localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

// Mock for fetch
global.fetch = jest.fn();

// Suppress console errors during tests
console.error = jest.fn();
