import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Build into a fresh directory so we don't try to clean a previous dist
    // owned by another process (the cloud-sync layer locks some files).
    outDir: "build",
    // Don't try to wipe a pre-existing output dir — files there may be
    // locked by the cloud-sync layer. Vite will overwrite chunks in place.
    emptyOutDir: false,
  },
});
