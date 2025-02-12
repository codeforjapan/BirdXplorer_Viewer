import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      setupFiles: ["./test/vitest-setup.ts"],
      environment: "jsdom",
      reporters:
        process.env.GITHUB_ACTIONS != null
          ? ["default", "github-actions"]
          : "default",
    },
  }),
);
