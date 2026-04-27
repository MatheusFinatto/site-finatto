export type TipoImovel = "chacara" | "casa" | "terreno" | "pavilhao";

export interface Imovel {
  id: string;
  slug: string;
  titulo: string;
  tipo: TipoImovel;
  status: "disponivel" | "vendido" | "reservado";
  tag: string | null;
  preco: number;
  area_total: number;
  area_construida: number | null;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  cidade: string;
  bairro: string;
  logradouro?: string; // "Rua das Flores, 123" ou "Comunidade Rio Turvo"
  complemento?: string; // "Ap 201", "Galpão dos fundos", etc.
  descricao: string;
  fotos: string[];
}
