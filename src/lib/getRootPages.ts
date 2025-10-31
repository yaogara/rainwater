import type { AllContent } from "../types/content";
import { getCollection } from "astro:content";

export async function getBlogPages() {
  const allPosts = await getCollection("blog");
  return allPosts.map((entry) => ({params: {slug: entry.id }, props: { entry }}));
}

export async function getRootPages(remapIndex: boolean = true) {
  const allListings = await getCollection("directory");
  const allPages = await getCollection("pages");

  // Combine listings and pages
  const combinedEntries: Array<AllContent> = allListings.concat(allPages as never);

  // Return paths based on slugs
  return combinedEntries.map((entry) => {
    let mySlug: string = entry.id;

    if (mySlug === "index" && remapIndex) {
      mySlug = "/";
    }

    return {
      params: { slug: mySlug },
      props: { entry },
    };
  });
}
