import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allImovelIdsQuery } from "@/sanity/lib/queries";
import { BASE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ids: string[] = await client.fetch(allImovelIdsQuery);
  const imovelRoutes = ids.map((id) => ({
    url: `${BASE_URL}/imoveis/${id}`,
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
