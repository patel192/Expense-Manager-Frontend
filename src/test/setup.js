import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

// Prevent jsdom navigation error
Object.defineProperty(window, "location", {
  value: {
    ...window.location,
    assign: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
});
