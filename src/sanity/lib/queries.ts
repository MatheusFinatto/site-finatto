import { groq } from "next-sanity";

// Campos comuns a todas as queries de imóvel
const IMOVEL_FIELDS = groq`
  "id": _id,
  "createdAt": _createdAt,
  "slug": coalesce(slug.current, _id),
  titulo,
  tipo,
  status,
  tag,
  preco,
  area_total,
  area_construida,
  quartos,
  banheiros,
  vagas,
  cidade,
  bairro,
  logradouro,
  complemento,
  lat,
  lng,
  descricao,
  "fotos": fotos[defined(asset)]{ "url": asset->url, alt },
`;

export const allImoveisQuery = groq`
  *[_type == "imovel"] | order(_createdAt desc) {
    ${IMOVEL_FIELDS}
  }
`;

export const imovelByIdQuery = groq`
  *[_type == "imovel" && _id == $id][0] {
    ${IMOVEL_FIELDS}
  }
`;

export const imovelBySlugQuery = groq`
  *[_type == "imovel" && (slug.current == $slug || _id == $slug)][0] {
    ${IMOVEL_FIELDS}
  }
`;

// Página do imóvel: outros do mesmo tipo ainda à venda
export const imoveisParecidosQuery = groq`
  *[_type == "imovel" && tipo == $tipo && status != "vendido" && coalesce(slug.current, _id) != $slug] {
    ${IMOVEL_FIELDS}
  }
`;

export const allImovelSlugsQuery = groq`
  *[_type == "imovel"]{ "slug": coalesce(slug.current, _id) }.slug
`;

// Sitemap: slug + last-modified timestamp for accurate <lastmod>
export const imovelSitemapQuery = groq`
  *[_type == "imovel"]{ "slug": coalesce(slug.current, _id), _updatedAt }
`;

export const allImovelIdsQuery = groq`
  *[_type == "imovel"]._id
`;

// Rodapé: tipos com pelo menos um imóvel publicado
export const tiposPublicadosQuery = groq`
  array::unique(*[_type == "imovel"].tipo)
`;
