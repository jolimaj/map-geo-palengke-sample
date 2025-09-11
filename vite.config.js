import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.js',
      name: "MapGeoPalengkeSample", // global name for <script> usage
      fileName: (format) => `map-geo-palengke-sample.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'leaflet'],
      output: {
        globals: {
          vue: 'Vue',
          leaflet: 'L'
        }
      }
    }
  }
});
