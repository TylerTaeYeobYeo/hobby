import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export function createViteConfig(options: { port?: number } = {}) {
  return defineConfig({
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    build: { outDir: "dist" },
    server: { port: options.port },
  });
}
