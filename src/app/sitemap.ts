import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { imovelSitemapQuery } from "@/sanity/lib/queries";
import { BASE_URL } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const imoveis: { slug: string; _updatedAt: string }[] =
    await client.fetch(imovelSitemapQuery);
  const imovelRoutes = imoveis.map(({ slug, _updatedAt }) => ({
    url: `${BASE_URL}/imoveis/${slug}`,
    lastModified: new Date(_updatedAt),
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
