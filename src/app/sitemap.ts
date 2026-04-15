import type { MetadataRoute } from 'next'
import imoveis from '@/data/imoveis.json'
import type { Imovel } from '@/lib/types'
import { BASE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const imovelRoutes = (imoveis as Imovel[]).map((i) => ({
    url: `${BASE_URL}/imoveis/${i.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...imovelRoutes,
  ]
}
