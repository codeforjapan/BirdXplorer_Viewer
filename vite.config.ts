import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

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

  ssr: {
    noExternal: [
      // react-tweet 内部の css の import が壊れるので ssr.noExternal に含める
      "react-tweet"
    ],
  },
});
