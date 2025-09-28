import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Critical for Electron - use relative paths
  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined // Prevent code splitting issues in Electron
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true
  }
});
