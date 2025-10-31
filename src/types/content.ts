import type { CollectionEntry } from "astro:content";

export type AllContent = CollectionEntry<'directory'> | CollectionEntry<'pages'>;