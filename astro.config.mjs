import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://yaogara.github.io/rainwater",
  base: "/rainwater/",
  output: "static",
  outDir: "./docs",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
