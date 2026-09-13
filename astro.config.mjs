import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://rainwaterdirectory.com",
  base: "/",
  output: "static",
  outDir: "./docs",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
