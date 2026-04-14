import { Imovel } from '@/lib/types'
import { formatArea, formatPreco, WHATSAPP_FINATTO } from '@/lib/utils'

const thumbGradient: Record<string, string> = {
  chacara: 'linear-gradient(150deg, #2a5010 0%, #3d7020 60%, #285010 100%)',
  casa:    'linear-gradient(150deg, #2a3a4a 0%, #3a5068 60%, #243040 100%)',
  terreno: 'linear-gradient(150deg, #5a4020 0%, #7a5830 60%, #4a3018 100%)',
  pavilhao:'linear-gradient(150deg, #1e2a3a 0%, #2a3a50 60%, #161e2a 100%)',
}

const tipoLabel: Record<string, string> = {
  chacara: 'Chácara',
  casa:    'Casa',
  terreno: 'Terreno',
  pavilhao:'Pavilhão',
}

interface Props { imovel: Imovel }

export default function ImovelRow({ imovel }: Props) {
  const msg = encodeURIComponent(
    `Olá! Tenho interesse no imóvel: ${imovel.titulo} (${formatPreco(imovel.preco)}). Poderia me dar mais informações?`
  )
  const waLink = `https://wa.me/${WHATSAPP_FINATTO}?text=${msg}`

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="grid items-center border-b border-border group transition-colors hover:bg-muted"
      style={{
        gridTemplateColumns: '180px 1fr auto auto auto',
        gap: 32,
        padding: '20px 0',
        textDecoration: 'none',
      }}
    >
      {/* Thumb */}
      <div className="relative overflow-hidden" style={{ height: 120, flexShrink: 0 }}>
        <div
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          style={{ background: thumbGradient[imovel.tipo] ?? thumbGradient.chacara }}
        />
        {imovel.tag && (
          <span
            className="absolute top-2 left-2 bg-fg text-bg uppercase"
            style={{ fontSize: 9, letterSpacing: 1, padding: '3px 7px' }}
          >
            {imovel.tag}
          </span>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-accent uppercase" style={{ fontSize: 10, letterSpacing: 2, marginBottom: 5 }}>
          {tipoLabel[imovel.tipo]} · {imovel.bairro}
        </p>
        <p
          className="text-fg"
          style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 20, marginBottom: 8 }}
        >
          {imovel.titulo}
        </p>
        <div className="flex gap-4 text-muted-fg" style={{ fontSize: 13 }}>
          {imovel.quartos != null && <span>{imovel.quartos} quartos</span>}
          {imovel.banheiros != null && <span>{imovel.banheiros} banheiros</span>}
          {imovel.vagas != null && <span>{imovel.vagas} vagas</span>}
        </div>
      </div>

      {/* Area */}
      <div className="text-right" style={{ minWidth: 110 }}>
        <span
          className="text-fg"
          style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 22, display: 'block' }}
        >
          {formatArea(imovel.area_total)}
        </span>
        <span className="text-muted-fg uppercase" style={{ fontSize: 11, letterSpacing: 1 }}>
          área total
        </span>
      </div>

      {/* Price */}
      <div className="text-right" style={{ minWidth: 150 }}>
        <span
          className="text-fg"
          style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 20, display: 'block' }}
        >
          {formatPreco(imovel.preco)}
        </span>
        <span className="text-muted-fg" style={{ fontSize: 11 }}>preço</span>
      </div>

      {/* Arrow */}
      <div className="flex justify-end" style={{ minWidth: 60 }}>
        <span
          className="inline-flex items-center justify-center border border-border text-fg group-hover:bg-fg group-hover:text-bg group-hover:border-fg transition-all"
          style={{ width: 44, height: 44, fontSize: 18 }}
        >
          →
        </span>
      </div>
    </a>
  )
}
