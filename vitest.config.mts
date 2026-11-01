import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // The skeleton has no financial behavior yet. Remove when tests land.
    passWithNoTests: true,
  },
});
