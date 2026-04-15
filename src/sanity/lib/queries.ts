import { groq } from 'next-sanity'

// Campos comuns a todas as queries de imóvel
const IMOVEL_FIELDS = groq`
  "id": _id,
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
  descricao,
  "fotos": fotos[].asset->url,
`

export const allImoveisQuery = groq`
  *[_type == "imovel"] | order(_createdAt desc) {
    ${IMOVEL_FIELDS}
  }
`

export const imovelByIdQuery = groq`
  *[_type == "imovel" && _id == $id][0] {
    ${IMOVEL_FIELDS}
  }
`

export const allImovelIdsQuery = groq`
  *[_type == "imovel"]._id
`
