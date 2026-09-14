import { z, defineCollection } from "astro:content";

const evidence = z.object({
  source_url: z.string().url(),
  source_excerpt: z.string().min(10),
  verified_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["verified", "needs_review", "unverified"]),
});

const installers = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    state: z.string(),
    city: z.string(),
    summary: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    installers: z.array(z.object({
      name: z.string(),
      phone: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
      address: z.string().optional(),
      rating: z.number().optional(),
      reviews_count: z.number().optional(),
      services: z.array(z.string()).optional(),
      certifications: z.string().optional(),
      audiences: z.string().optional(),
      service_area: z.array(z.string()).optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
      evidence: z.object({
        entity: evidence.optional(),
        contact: evidence.optional(),
        services: evidence.optional(),
        credentials: evidence.optional(),
        reviews: evidence.optional(),
      }).optional(),
      verified: z.boolean().optional(),
    })),
  }),
});

const states = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    rainfall: z.number().optional(),
    legality: z.string().optional(),
    incentives: z.string().optional(),
    sources: z.array(evidence).optional(),
  }),
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { installers, states, blog };
