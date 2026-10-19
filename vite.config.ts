import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/handoff-eval-agent/",
  plugins: [react()],
  test: {
    environment: "node",
    // Playwright specs run separately in CI with pinned browser tooling.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
