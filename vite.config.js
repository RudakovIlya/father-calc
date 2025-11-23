import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/father-calc/",
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Calculator",
        short_name: "Calc",
        description: "Father calculator",
        theme_color: "#333",
        background_color: "#333",
        display: "standalone",
        icons: [
          {
            src: "icon-30x30.png",
            sizes: "30x30",
            type: "image/png",
          },
          {
            src: "icon-90x90.png",
            sizes: "90x90",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
