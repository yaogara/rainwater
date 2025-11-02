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
      website: z.string().optional(),
      rating: z.number().optional(),
      services: z.array(z.string()).optional(),
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
