---
name: blog-seo-images
description: Best practices, image specifications, alt text formulas, Core Web Vitals (LCP), Open Graph tags, and generation procedures for Rainwater Directory blog articles and social media assets.
---

# Blog SEO & Featured Image Best Practices

This skill outlines the mandatory specifications and procedures for creating, optimizing, and deploying featured images and social metadata across `rainwaterdirectory.com`.

---

## 1. Golden Rules for Blog Images

1. **Every Article Must Have a Featured Image**:
   - Never publish an article without a custom, high-resolution featured image (`image`) and accessibility-compliant alt text (`imageAlt`).
2. **Aspect Ratio & Dimensions**:
   - **Target Resolution**: Exactly **1200 × 675 pixels** (16:9 aspect ratio).
   - **Open Graph Compatibility**: 1200×675 automatically scales to 1200×630 (1.91:1) on Facebook and LinkedIn, and fills the Twitter/X `summary_large_image` card without clipping.
3. **Format & Performance**:
   - Use **WebP** format (`.webp`) compressed at **quality 85–90%**.
   - **Target File Size**: 40 KB – 80 KB (Never exceed 150 KB).
   - Storage path: `public/images/blog/<article-slug>.webp`.
4. **Google Search & Discover Directives**:
   - Always include `<meta name="robots" content="max-image-preview:large" />` in the HTML `<head>`.
   - Always define `image: { "@type": "ImageObject", "url": "...", "width": 1200, "height": 675 }` inside the `BlogPosting` JSON-LD schema.

---

## 2. Core Web Vitals & LCP Rules

Following the Modern Web Guidance standards:

### On the Blog Article Page (`/blog/[slug]`):
- The featured hero image is the **Largest Contentful Paint (LCP)** candidate.
- **Mandatory Attributes**:
  - `fetchpriority="high"` (ensures browser starts downloading immediately).
  - `decoding="async"` (avoids blocking main thread rendering).
  - Explicit `width="1200"` and `height="675"` (prevents Cumulative Layout Shift / CLS).
  - **NEVER** use `loading="lazy"` on the hero image.
  - Wrap in semantic `<figure>` with `<figcaption>`.

```html
<figure class="not-prose my-8">
  <img
    src="/images/blog/how-to-choose-an-installer.webp"
    alt="Professional rainwater harvesting installer vetting checklist and cost breakdown"
    width="1200"
    height="675"
    fetchpriority="high"
    decoding="async"
    class="aspect-video w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
  />
  <figcaption class="mt-2 text-center text-xs text-slate-500">
    Professional rainwater harvesting installer vetting checklist and cost breakdown
  </figcaption>
</figure>
```

### On the Blog Index Page (`/blog`):
- Card thumbnails appear below the fold or in a multi-item grid.
- **Mandatory Attributes**:
  - `loading="lazy"`
  - `decoding="async"`
  - `width="600"` and `height="338"`
  - Omit `fetchpriority` to let browser heuristics manage scroll priorities.

---

## 3. Alt Text Standards (E-E-A-T & A11y)

Alt text must describe the visual and informational content of the image for visually impaired users and search engine crawlers.

### The Formula:
`[Primary Subject] + [Specific Components or Context] + [Purpose or Setting]`

### Examples:
- **Good**: `50-State statutory reference matrix and legal guide for residential and commercial rainwater harvesting systems`
- **Good**: `Multi-stage potable rainwater filtration train featuring sediment filter, carbon block, and stainless steel ultraviolet UV sterilizer`
- **Good**: `Underground rainwater cistern engineering cross-section showing excavation depth, access riser, and submersible pump`
- **Strictly Prohibited**:
  - `Image of rainwater` (Lacks context)
  - `rainwater harvesting, rain barrel, cistern, contractor` (Keyword stuffing violates `agent/SEO_RULES.md`)
  - `DSC00124.jpg` or empty alt string

---

## 4. Visual Design System

When generating new featured images (via `scripts/generate_blog_images.cjs` or generative tools):

1. **Background**: Dark oceanic palette (`#09141c` to `#0e2330`) with subtle technical grid and water droplet accents.
2. **Left Column**:
   - Brand header: `Rainwater Directory • [TOPICAL CATEGORY]`
   - Pill badge: e.g. `50-STATE MATRIX`, `HEALTH & SCIENCE`, `CONTRACTOR GUIDE`
   - Headline: Crisp 44px bold white typography.
   - Subtitle: 20px slate-300 summary.
   - Feature highlight pill: 14px key technical takeaways.
3. **Right Column**: Technical schematic or diagram illustrating the core mechanical or regulatory concept.
4. **Footer**: `RAINWATERDIRECTORY.COM • FACT-CHECKED & CODE-VERIFIED GUIDES • STANDARDS: ARCSA / ASPE 63 / UPC CH. 16`.

---

## 5. Adding an Image to a New Post

1. Create or generate the 1200x675 image.
2. Optimize with `sharp` to WebP format (< 80 KB).
3. Save to `public/images/blog/<slug>.webp`.
4. In the blog post frontmatter:
   ```yaml
   ---
   title: "Your Article Title"
   description: "Meta description..."
   pubDate: 2026-09-13
   author: "Rainwater Directory Technical Team"
   image: "/images/blog/your-slug.webp"
   imageAlt: "Descriptive alt text following the formula..."
   ---
   ```
5. Run `npm test` and `npm run build` to verify generation and sitemap inclusion.
