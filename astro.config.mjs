import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://rainwaterdirectory.com",
  base: "/",
  output: "static",
  outDir: "./docs",
  redirects: {
    "/blog/is-it-illegal-to-collect-rainwater-state-by-state-2025": "/blog/is-it-illegal-to-collect-rainwater-state-by-state",
    "/blog/rainwater-harvesting-legal-status": "/blog/is-it-illegal-to-collect-rainwater-state-by-state",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
