import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@tanstack/react-query"))
              return "vendor-react-query";
            if (id.includes("recharts")) return "vendor-recharts";
            if (id.includes("firebase")) return "vendor-firebase";
            if (id.includes("@stripe")) return "vendor-stripe";
            if (id.includes("react-router-dom")) return "vendor-router";
            if (id.includes("react-dom") || id.includes("react"))
              return "vendor-react";
            return "vendor";
          }
        },
      },
    },
  },
});
