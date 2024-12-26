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
          src: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
          dest: "dist/assets"
        },
        {
          src: "public/manifest.json",
          dest: "dist"
        },
        {
          src: "public/icons",
          dest: "dist"
        }
      ],
      hook: "writeBundle"
    })
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/background.ts"),
        contentScript: resolve(__dirname, "src/ContentScript.ts")
      },
      output: [
        {
          // Output for the extension UI (React app)
          dir: 'dist',
          entryFileNames: 'assets/[name].js',
          format: 'es',
          name: 'app'
        },
        {
          // Output for background and content scripts
          dir: 'dist',
          entryFileNames: 'assets/[name].js',
          format: 'es',
          preserveModules: false
        }
      ]
    },
    target: "esnext",
    minify: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});