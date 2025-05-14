import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      outDir: "dist",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    lib: {
      formats: ["es", "cjs", "umd"],
      entry: resolve(__dirname, "src/squatch.ts"),
      fileName: (format) => {
        if (format === "es") {
          return "squatch.esm.js";
        } else if (format === "umd") {
          return "squatch.js";
        } else {
          return `squatch.${format}.js`;
        }
      },
      name: "squatch",
    },
    outDir: resolve(__dirname, "dist"),
    minify: false,
    rollupOptions: {
      output: {
        amd: { define: "false" },
        format: "umd",
      },
    },
    sourcemap: true,
  },
});
