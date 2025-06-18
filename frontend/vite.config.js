import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
// https://vite.dev/config/


export default defineConfig({
  plugins: [react()],
server: {
  port: 5173 // Usa el puerto default de Vite
},
  resolve: {
    alias: {
      "@images": path.resolve(__dirname, "images"),
    },
  },
});
