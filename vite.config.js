import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"), // main entry for your library
      name: "SariayaMap", // global name for <script> usage
      fileName: (format) => `sariaya-map.${format}.js`
    },
    rollupOptions: {
      external: ["vue"], // don’t bundle Vue itself
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});
