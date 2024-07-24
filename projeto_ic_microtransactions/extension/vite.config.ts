import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Get the absolute path to the project root directory.
const projectRootDir = resolve(__dirname);

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Use resolve to build absolute paths based on the current directory
        main: resolve(projectRootDir, "./index.html"), // Entry point for the popup or main HTML file
        background: resolve(projectRootDir, "./src/background.ts"), // Path to your background script
        contentScript: resolve(projectRootDir, "./src/ContentScript.ts"), // Path to your content script
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
