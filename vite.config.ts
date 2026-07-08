import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/handoff-eval-agent/",
  plugins: [react()],
  test: {
    environment: "node",
  },
});
