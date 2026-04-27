import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allImovelSlugsQuery } from "@/sanity/lib/queries";
import { BASE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs: string[] = await client.fetch(allImovelSlugsQuery);
  const imovelRoutes = slugs.map((slug) => ({
    url: `${BASE_URL}/imoveis/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...imovelRoutes,
  ];
}
