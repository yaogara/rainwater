# Rainwater Directory

Rainwater Directory is an Astro-powered directory that helps U.S. homeowners discover certified rainwater harvesting installers. Content is organized by state and city using Astro content collections, with schema.org markup and clean Tailwind UI components for strong SEO.

## Features

- ⚡️ Fast Astro site with Tailwind styling in a blue–green palette
- 📍 Installer listings organized State → City
- 🔍 Fuse.js powered search for cities and states
- 🧠 Rich schema.org structured data for LocalBusiness, Place, FAQPage, BlogPosting, and BreadcrumbList
- 📝 Content managed through Markdown collections and a CSV-to-Markdown conversion script

## Project Structure

```
src/
├── components/
│   ├── FAQ.astro
│   ├── InstallerCard.astro
│   ├── Schema.astro
│   └── SearchBar.astro
├── content/
│   ├── blog/
│   ├── installers/
│   └── states/
├── layouts/
│   ├── BaseLayout.astro
│   └── StateLayout.astro
├── pages/
│   ├── blog/[slug].astro
│   ├── index.astro
│   ├── installers/[state]/[city].astro
│   └── states/[state].astro
└── data/
    └── trends.csv
```

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:4321`.

## Managing Content

- Add state, city, and blog content in `src/content/` using Markdown frontmatter that matches the collection schemas in `src/content/config.ts`.
- Convert external installer data with the CSV helper:
  ```bash
  node scripts/csv-to-md.js
  ```
  The script reads `data/installers.csv` and writes city Markdown files to `src/content/installers/`.

## Deployment

Build a static production bundle:

```bash
npm run build
```

You can serve the contents of `dist/` with any static host (Netlify, Vercel, GitHub Pages, etc.) or preview locally:

```bash
npm run preview
```

## License

MIT
