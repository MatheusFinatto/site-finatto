import type { TipoImovel } from './types'

export const ANO_FUNDACAO = 2006
export const BASE_URL = 'https://www.finattoincorporadora.com.br'
export const ANOS_CONSTRUTORA = 13 // anos operando como construtora antes de virar incorporadora
export const IMOVEIS_ENTREGUES = '500+'

/** Anos de mercado calculados dinamicamente */
export function anosDeExperiencia(): number {
  return new Date().getFullYear() - ANO_FUNDACAO
}

// ── Imóvel display maps ──────────────────────────────────────────────────────

export const TIPO_LABEL: Record<TipoImovel, string> = {
  chacara: 'Chácara',
  casa: 'Casa',
  terreno: 'Terreno',
  pavilhao: 'Pavilhão',
}

export const THUMB_GRADIENT: Record<TipoImovel, string> = {
  chacara: 'linear-gradient(150deg, #2a5010 0%, #3d7020 60%, #285010 100%)',
  casa:    'linear-gradient(150deg, #2a3a4a 0%, #3a5068 60%, #243040 100%)',
  terreno: 'linear-gradient(150deg, #5a4020 0%, #7a5830 60%, #4a3018 100%)',
  pavilhao:'linear-gradient(150deg, #1e2a3a 0%, #2a3a50 60%, #161e2a 100%)',
}

/** Tailwind classes por tag — fallback: 'bg-fg text-bg' */
export const TAG_COLORS: Record<string, string> = {
  Destaque: 'bg-accent text-accent-fg',
  Oportunidade: 'bg-yellow-500 text-black',
  'Última Unidade': 'bg-red-600 text-white',
}

// ── Filter tabs ──────────────────────────────────────────────────────────────

export const TIPO_TABS: { value: TipoImovel | ''; label: string }[] = [
  { value: '',         label: 'Todos' },
  { value: 'chacara',  label: 'Chácaras' },
  { value: 'casa',     label: 'Casas' },
  { value: 'terreno',  label: 'Terrenos' },
  { value: 'pavilhao', label: 'Pavilhões' },
]

// ── WhatsApp messages ────────────────────────────────────────────────────────

export const WPP_MSG_FINATTO = 'Olá, Finatto! Gostaria de informações sobre imóveis.'
export const WPP_MSG_FLAVIA = 'Olá, Flávia! Gostaria de informações sobre imóveis.'
export const WPP_MSG_PARCERIA =
  'Olá! Tenho uma área e gostaria de conversar sobre a possibilidade de um loteamento.'

export function wppMsgImovel(titulo: string, preco: string): string {
  return `Olá! Tenho interesse no imóvel: ${titulo} (${preco}). Poderia me dar mais informações?`
}
