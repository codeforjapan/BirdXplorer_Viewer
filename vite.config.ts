// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest/config" />

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defaultExclude } from "vitest/config";

export default defineConfig({
  plugins: [
    // for vitest
    !process.env.VITEST ? reactRouter() : react(),
    tailwindcss(),
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
    tsconfigPaths(),
  ],
  test: {
    projects: [
      {
        test: {
          name: "Node",
          environment: "node",
          exclude: [...defaultExclude, "**/*.browser.test.{ts,tsx}"],
        },
      },
      {
        test: {
          name: "Browser",
          browser: {
            enabled: true,
            provider: "playwright",
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
            headless: true,
          },
          include: ["**/*.browser.test.{ts,tsx}"],
        },
      },
    ],
  },
});
