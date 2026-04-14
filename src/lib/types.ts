export type TipoImovel = 'chacara' | 'casa' | 'terreno' | 'pavilhao'

export interface Imovel {
  id: string
  titulo: string
  tipo: TipoImovel
  status: 'disponivel' | 'vendido' | 'reservado'
  tag: string | null
  preco: number
  area_total: number
  area_construida: number | null
  quartos: number | null
  banheiros: number | null
  vagas: number | null
  cidade: string
  bairro: string
  descricao: string
  fotos: string[]
}
