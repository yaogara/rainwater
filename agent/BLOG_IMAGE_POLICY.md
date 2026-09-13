# Blog Image & Visual SEO Policy

This policy governs all featured images, Open Graph assets, and diagrams published on `rainwaterdirectory.com`.

---

## 1. Core Technical Standards

1. **Aspect Ratio & Dimensions**:
   - **Primary Hero / Open Graph**: Standard 16:9 ratio at **1200 × 675 pixels**.
   - Ensures perfect compatibility across Open Graph (`og:image`), Twitter cards (`twitter:image`), and Google Discover feeds.
   - Every `<img>` element MUST specify explicit `width="1200"` and `height="675"` to eliminate Cumulative Layout Shift (CLS).

2. **File Format & Compression**:
   - **WebP** (`.webp`) format exclusively.
   - Maximum file size: **< 80 KB** (strict ceiling of 100 KB).
   - Compression settings: WebP Quality 85–90%, effort 6.
   - Avoid bloated JPEGs or raw PNGs.

3. **Core Web Vitals & Loading Behavior**:
   - Above-the-fold hero images MUST specify `fetchpriority="high"` and `decoding="async"`.
   - **NEVER** set `loading="lazy"` on the hero image of an article (violates LCP best practices).
   - Card/listing thumbnails on `/blog` index MUST specify `loading="lazy"`, `decoding="async"`, and explicit dimensions (`width="600"`, `height="338"`).

4. **Search Discovery Tagging**:
   - Every page header MUST contain `<meta name="robots" content="max-image-preview:large" />` to enable rich full-bleed previews in Google Discover and Google Search snippets.

---

## 2. Alt Text & Accessibility Rules

1. **Alt Text Formula**:
   - Every image MUST include accurate, concise, descriptive alt text following this formula:
     `[Primary Subject] + [Key Components/Actions] + [Context/Standard]`
   - *Example*: `"Potable rainwater purification train showing multi-stage sediment filters, activated carbon, and NSF 55 Class A UV disinfection"`

2. **Zero Fabrication & Spam Policy**:
   - **No keyword stuffing**: Never cram standalone keywords like `"rainwater harvesting, rain barrel, buy water tank"` into alt text.
   - **Accurate technical terminology**: Alt text must accurately reflect real rainwater engineering concepts (e.g., ASPE/ARCSA Standard 63, first-flush diverter, food-grade HDPE, air gap backflow).
   - **Captions**: Every hero image should be wrapped in `<figure>` with an accompanying `<figcaption>` explaining the diagram or schematic.

---

## 3. Image Generation Pipeline

Blog hero schematics can be generated or updated using the automated Sharp pipeline:

- **Script**: `scripts/generate_blog_images.cjs`
- **Execution**: `node scripts/generate_blog_images.cjs`
- **Asset Directory**: `public/images/blog/`

When adding a new article:
1. Add the article metadata and SVG diagram definition to `scripts/generate_blog_images.cjs`.
2. Ensure all text strings escape XML entities (`&` to `&amp;`, `<` to `&lt;`, `>` to `&gt;`).
3. Run `node scripts/generate_blog_images.cjs`.
4. Reference the image in the article's frontmatter:
   ```yaml
   image: "/images/blog/my-new-post-slug.webp"
   imageAlt: "Descriptive technical summary of the image components and context"
   ```
5. Run `npm test` and `npm run build` to verify.
