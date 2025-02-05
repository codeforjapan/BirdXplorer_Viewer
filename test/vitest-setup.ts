import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import baseUserEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";

export const userEvent = baseUserEvent.setup();

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
