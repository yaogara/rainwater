import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const isProduction = process.env.NODE_ENV === "production";

const site =
  process.env.PUBLIC_SITE ??
  (isProduction ? "https://yaogara.github.io/rainwater" : "http://localhost:4321");

const siteURL = new URL(site);

const rawBase = process.env.PUBLIC_BASE_PATH ??
  (siteURL.pathname === "/" ? "/" : `${siteURL.pathname.replace(/\/+$/g, "")}/`);

const normalizedBase =
  rawBase === "/"
    ? "/"
    : `/${rawBase.replace(/^\/+|\/+$/g, "")}/`;

export default defineConfig({
  site,
  base: normalizedBase,
  output: "static",
  outDir: "./docs",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
