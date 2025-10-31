import configData from "@util/themeConfig";
import { defineCollection } from "astro:content";
import { sheetLoad } from "./sheets";
import { directorySchema } from "@validation/directory";
import { z } from "zod";
import { mockLoader } from "@ascorbic/mock-loader";
import { glob, file } from "astro/loaders";
import { airtableLoader } from "@ascorbic/airtable-loader";
import { notionLoader } from "notion-astro-loader";

export function createDirectoryCollection() {
  const source = configData.directoryData.source.name;

  if (source === 'sheets') {
    return defineCollection({
      loader: sheetLoad(),
      schema: directorySchema(z.string().url())
    });
  }
  if (source === 'mock') {
    return defineCollection({
      loader: mockLoader({schema: directorySchema(z.string().url()), entryCount: 10},),
      schema: directorySchema(z.undefined())
    });
  }
  if (source === 'json') {
    return defineCollection({
      loader: file('src/data/directory/directory.json'),
      schema: ({ image }) => directorySchema(image())
    });
  }
  if (source === 'csv') {
    return defineCollection({
      loader: file('src/data/directory/directory.csv'),
      schema: ({ image }) => directorySchema(image())
    });
  }
  if (source === 'airtable') {
    const airtableConfig = configData.directoryData.source.airtable;
    if (!airtableConfig?.base || !airtableConfig.name) {
      throw Error('You need to configure a airtable base id and table name to be able to connect with airtable data.')
    }

    return defineCollection({
      loader: airtableLoader({
        base: airtableConfig.base,
        table: airtableConfig.name,
      }),
      schema: directorySchema(z.string().url())
    });
  }
  if (source === 'notion') {
    const notionToken = import.meta.env.NOTION_TOKEN;
    const databaseId = configData.directoryData.source.notion?.databaseId;

    if (!notionToken || !databaseId) {
      throw Error('You need to add a notion token in the .env as NOTION_TOKEN file and your databaseId in the settings.toml to use notion')
    }

    return defineCollection({
      loader: notionLoader({
        auth: notionToken,
        database_id: databaseId
      }),
      schema: directorySchema(z.string().url())
    });
  }

  return defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/data/directory" }),
    schema: ({ image }) => directorySchema(image())
  });
}