import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://sports-backend:5000", // ✅ docker service name
        changeOrigin: true,
      },
    },
  },
});
