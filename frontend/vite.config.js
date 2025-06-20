import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
// https://vite.dev/config/


export default defineConfig({
  plugins: [react()],
server: {
  proxy: {
    "/api": {
      target: "http://localhost:3001", // Cambia esto al puerto de tu backend
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
  port: 5173, // Usa el puerto default de Vite
  strictPort: true, // Asegura que el puerto sea el mismo siempre
},
  resolve: {
    alias: {
      "@images": path.resolve(__dirname, "images"),
    },
  },
});
