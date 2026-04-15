import { Imovel } from '@/lib/types'
import { formatArea, formatPreco, WHATSAPP_FINATTO, whatsappLink } from '@/lib/utils'
import { TIPO_LABEL, THUMB_GRADIENT, wppMsgImovel } from '@/lib/constants'
import WppIcon from './WppIcon'

interface Props { imovel: Imovel }

export default function ImovelRow({ imovel }: Props) {
  const waLink = whatsappLink(
    WHATSAPP_FINATTO,
    wppMsgImovel(imovel.titulo, formatPreco(imovel.preco))
  )

  return (
    <a href={waLink} target="_blank" rel="noopener noreferrer" className="imovel-row group">

      {/* Thumb */}
      <div className="imovel-row-thumb relative overflow-hidden flex-shrink-0">
        <div
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          style={{ background: THUMB_GRADIENT[imovel.tipo] ?? THUMB_GRADIENT.chacara }}
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
          {TIPO_LABEL[imovel.tipo]} · {imovel.logradouro ?? imovel.bairro}
          {imovel.complemento ? `, ${imovel.complemento}` : ''}
        </p>
        <p className="text-fg" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 20, marginBottom: 8 }}>
          {imovel.titulo}
        </p>
        <div className="flex flex-wrap gap-3 text-muted-fg" style={{ fontSize: 13 }}>
          {imovel.quartos   != null && <span>{imovel.quartos}   quartos</span>}
          {imovel.banheiros != null && <span>{imovel.banheiros} banheiros</span>}
          {imovel.vagas     != null && <span>{imovel.vagas}     vagas</span>}

          {/* Price + WPP hint — mobile only */}
          <span className="md:hidden font-semibold text-fg">{formatPreco(imovel.preco)}</span>
          <span className="md:hidden inline-flex items-center gap-1" style={{ color: 'var(--wpp-green)', fontSize: 12 }}>
            <WppIcon size={12} /> Saber mais
          </span>
        </div>
      </div>

      {/* Area — desktop only */}
      <div className="imovel-row-area text-right" style={{ minWidth: 110 }}>
        <span className="text-fg block" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 22 }}>
          {formatArea(imovel.area_total)}
        </span>
        <span className="text-muted-fg uppercase" style={{ fontSize: 11, letterSpacing: 1 }}>
          área total
        </span>
      </div>

      {/* Price — desktop only */}
      <div className="imovel-row-price text-right" style={{ minWidth: 150 }}>
        <span className="text-fg block" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 20 }}>
          {formatPreco(imovel.preco)}
        </span>
        <span className="text-muted-fg" style={{ fontSize: 11 }}>preço</span>
      </div>

      {/* WPP button — desktop only */}
      <div className="imovel-row-arrow flex justify-end" style={{ minWidth: 120 }}>
        <span
          className="inline-flex items-center gap-2 font-medium transition-opacity group-hover:opacity-80"
          style={{ background: 'var(--wpp-green)', color: '#fff', padding: '10px 16px', fontSize: 12, whiteSpace: 'nowrap' }}
        >
          <WppIcon size={14} /> Saber mais
        </span>
      </div>
    </a>
  )
}
