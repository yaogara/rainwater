import { z } from "zod";

const layoutSchema = z.object({
  sidebar: z.boolean().default(false),
  emoji: z.boolean().default(false),
})

const generalSchema = z.object({
  title: z.string(),
  logo: z.string(),
  iconLogo: z.string(),
  seo: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
  }),
});

const headerSchema = z.object({
  banner: z.object({
    show: z.boolean(),
    text: z.string(),
    link: z.string().url(),
    brandText: z.string(),
  }),
  navbar: z.object({
    colorModeSelector: z.boolean().optional().default(false),
    links: z.array(
      z.object({
        name: z.string(),
        href: z.string(),
        target: z.string().optional(),
      })
    ),
  }),
  actionButton: z.object({
    text: z.string(),
    href: z.string().url(),
  }),
});

const footerSchema = z.object({
  description: z.string(),
  socials: z.object({
    github: z.object({ link: z.string() }).optional(),
    facebook: z.object({ link: z.string() }).optional(),
    instagram: z.object({ link: z.string() }).optional(),
    x: z.object({ link: z.string() }).optional(),
    youtube: z.object({ link: z.string() }).optional(),
  }),
});

const uiSchema = z.object({
  icons: z.object({
    dark: z.string(),
    light: z.string(),
    instagram: z.string(),
    youtube: z.string(),
    facebook: z.string(),
    x: z.string(),
  }),
});

const directoryData = z.object({
  source: z.object({
    name: z.string(),
    linksOutbound: z.boolean().default(false),
    sheets: z
      .object({
        key: z.string(),
      })
      .optional(),
    airtable: z.object({
      base: z.string(),
      name: z.string(),
    })
    .optional(),
    notion: z.object({
      databaseId: z.string(),
    })
    .optional(),
  }),
  tagPages: z.object({
    title: z.string(),
  }),
  search: z.object({
    placeholder: z.string(),
  }),
  tags: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
      color: z.string().optional(),
      emoji: z.string().optional(),
      description: z.string().optional(),
    })
  ),
});

const directoryUI = z.object({
  grid: z.object({
    type: z.enum(["icon-list", "rectangle-card-grid", "small-card-grid"]),
    emptyState: z.object({
      text: z.string(),
      type: z.enum(["button", "simple", "link"]),
      icon: z.string(),
    }),
    card: z.object({
      image: z.boolean(),
    }),
    submit: z.object({
      show: z.boolean(),
      first: z.boolean(),
      title: z.string(),
      description: z.string(),
      hideable: z.boolean(),
    }),
  }),
  search: z.object({
    showCount: z.boolean(),
    icon: z.string(),
    tags: z.object({
      display: z.enum(["none", "select", "show-all"]),
      intersection: z.boolean(),
    }),
  }),
  featured: z.object({
    showOnAllPages: z.boolean(),
    showOnSide: z.boolean(),
    icon: z.string(),
    labelForCard: z.string(),
  }),
});

const listingsSchema = z.object({
  pageHeader: z.enum(["none", "title"]),
});

// todo separate directory ui config from directory data config.
const themeSettingsSchema = z.object({
  theme: z.string(),
  general: generalSchema,
  header: headerSchema,
  directoryData: directoryData,
  footer: footerSchema,
});

const themeSchema = z.object({
  listings: listingsSchema,
  directoryUI: directoryUI,
  ui: uiSchema,
  layout: layoutSchema,
});

const settingsSchema = z.object({
  general: generalSchema,
  listings: listingsSchema,
  directoryData: directoryData,
  directoryUI: directoryUI,
  header: headerSchema,
  footer: footerSchema,
  ui: uiSchema,
  layout: layoutSchema,
});

type SettingsSchema = z.infer<typeof settingsSchema>;

export { settingsSchema, themeSettingsSchema, themeSchema, type SettingsSchema };