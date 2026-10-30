// Global test setup
import { vi } from "vitest";

// Suppress console.error during tests
vi.spyOn(console, "error").mockImplementation(() => {});
