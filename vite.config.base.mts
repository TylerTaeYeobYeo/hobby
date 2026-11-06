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
    // host: true exposes the dev server on the LAN so phones on the same
    // network can open it directly (URL is printed by `vite` on startup).
    server: { port: options.port, host: true },
  });
}
