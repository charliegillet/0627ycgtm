import { defineConfig } from "vitest/config";

// The lib tests are pure Node (no Convex/edge runtime needed).
export default defineConfig({
  test: {
    environment: "node",
    include: ["convex/lib/**/*.test.ts"],
  },
});
