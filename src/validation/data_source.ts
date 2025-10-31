import { z } from "zod";

const sourceSchema = z.enum(["mock", "sheets", "json", "csv", "airtable", "notion"]);

const dataSchema = z.object({
  source: sourceSchema.default("mock"),
  mock: z.object({
    entryCount: z.number().default(10),
  }).optional(),
  sheets: z.object({
    key: z.string().min(1, "Key is required for sheets"),
  }).optional(),
  airtable: z.object({
    base: z.string().min(1, "Base ID is required for Airtable"),
    name: z.string().min(1, "Table Name is required for Airtable"),
  }).optional(),
  notion: z.object({
    databaseId: z.string().min(1, "Database ID is required for Notion"),
  }).optional(),
}).superRefine((data, ctx) => {
  if (data.source === "sheets" && !data.sheets?.key) {
    ctx.addIssue({
      path: ["sheets", "key"],
      message: "Key is required when source is 'sheets'",
      code: z.ZodIssueCode.custom,
    });
  }
  if (data.source === "airtable" && (!data.airtable?.base || !data.airtable?.name)) {
    ctx.addIssue({
      path: ["airtable"],
      message: "Base ID and Table Name are required when source is 'airtable'",
      code: z.ZodIssueCode.custom,
    });
  }
  if (data.source === "notion" && !data.notion?.databaseId) {
    ctx.addIssue({
      path: ["notion"],
      message: "Database ID is required when source is 'notion'",
      code: z.ZodIssueCode.custom,
    });
  }
});

type DataSettingsSchema = z.infer<typeof dataSchema>;

export { dataSchema, type DataSettingsSchema };