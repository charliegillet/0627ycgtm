import { defineConfig } from "vitest/config";

// Pure lib tests run in the default node env. The convex-test integration
// test opts into the edge-runtime VM via a `// @vitest-environment edge-runtime`
// docblock at the top of that file (vitest v4 removed environmentMatchGlobs).
export default defineConfig({
  test: {
    include: [
      "convex/lib/**/*.test.ts",
      "convex/**/*.integration.test.ts",
    ],
    server: { deps: { inline: ["convex-test"] } },
  },
});
