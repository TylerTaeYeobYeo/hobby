import { defineConfig } from "vite";

// plugins
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { esmExternalRequirePlugin } from "rolldown/plugins";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({ include: ["src"], tsconfigPath: "./tsconfig.app.json" }),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "ui",
      fileName: "index",
      // fileName: (format) => `ui.${format}.js`,
    },
    rolldownOptions: {
      plugins: [
        esmExternalRequirePlugin({
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "react/jsx-dev-runtime",
          ],
        }),
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
