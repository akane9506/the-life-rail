import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "three-core",
              test: /node_modules[\\/]three/,
            },
            {
              name: "r3f-vendors",
              test: /node_modules[\\/]@react-three/,
            },
            {
              name: "debug-vendors",
              test: /node_modules[\\/](leva|r3f-perf)[\\/]/,
            },
          ],
        },
      },
    },
  },
});
