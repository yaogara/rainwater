import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const rawBase = process.env.PUBLIC_BASE_PATH ?? "/";
const normalizedBase =
  rawBase === "/"
    ? "/"
    : `/${rawBase.replace(/^\/+|\/+$/g, "")}/`;

export default defineConfig({
  site: "https://rainwater.directory",
  base: normalizedBase,
  output: "static",
  outDir: "./docs",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
