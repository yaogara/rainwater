import { z, defineCollection } from "astro:content";

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
  }),
});

const blog = defineCollection({ type: "content" });

export const collections = { installers, states, blog };
