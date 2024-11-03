import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        {
          src: "src/browser-polyfill.js",
          dest: "dist/assets",
        },
      ],
      hook: "writeBundle",
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/background.ts"),
        contentScript: resolve(__dirname, "src/ContentScript.ts"),
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
