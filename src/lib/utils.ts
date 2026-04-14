export function formatPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function formatArea(m2: number): string {
  if (m2 >= 10000) {
    const ha = m2 / 10000
    return `${ha.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha`
  }
  return `${m2.toLocaleString('pt-BR')} m²`
}

export const WHATSAPP_FINATTO = '5554991636937'
export const WHATSAPP_FLAVIA = '5554991001050'

export function whatsappLink(numero: string, mensagem?: string): string {
  const msg = mensagem ? encodeURIComponent(mensagem) : ''
  return `https://wa.me/${numero}${msg ? `?text=${msg}` : ''}`
}
