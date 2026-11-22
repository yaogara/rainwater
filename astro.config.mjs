import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://rainwaterdirectory.com",
  base: "/",
  output: "static",
  outDir: "./docs",
  redirects: {
    "/blog/is-it-illegal-to-collect-rainwater-state-by-state-2025": "/blog/is-it-illegal-to-collect-rainwater-state-by-state/",
    "/blog/rainwater-harvesting-legal-status": "/blog/is-it-illegal-to-collect-rainwater-state-by-state/",
    "/installers/new-york/new-york": "/states/new-york/",
    "/installers/puerto-rico/00685": "/installers/puerto-rico/san-sebastian/",
    "/installers/texas/texas": "/states/texas/",
    "/installers/new-mexico/new-mexico": "/installers/new-mexico/cedar-crest/",
    "/installers/california/us": "/states/california/",
    "/installers/california/california": "/states/california/",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
