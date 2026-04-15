import { Imovel } from '@/lib/types'
import { formatArea, formatPreco, WHATSAPP_FINATTO, whatsappLink } from '@/lib/utils'
import { TIPO_LABEL, TAG_COLORS, wppMsgImovel } from '@/lib/constants'
import WppIcon from './WppIcon'

interface Props { imovel: Imovel }

export default function ImovelCard({ imovel }: Props) {
  const waLink = whatsappLink(
    WHATSAPP_FINATTO,
    wppMsgImovel(imovel.titulo, formatPreco(imovel.preco))
  )

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-card-border bg-card hover:shadow-lg transition-shadow group">
      {/* Foto */}
      <div className="relative h-52 bg-muted overflow-hidden">
        {/* Placeholder — trocar por <Image> com foto real */}
        <div className="w-full h-full" style={{ background: imovel.tipo === 'chacara'
          ? 'linear-gradient(135deg, #2d4a1e 0%, #4a7a30 50%, #6aaa44 100%)'
          : imovel.tipo === 'casa'
          ? 'linear-gradient(135deg, #3a3a3a 0%, #6b6b6b 100%)'
          : imovel.tipo === 'terreno'
          ? 'linear-gradient(135deg, #7a5c3a 0%, #a87d50 100%)'
          : 'linear-gradient(135deg, #2a2a4a 0%, #4a4a7a 100%)'
        }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="text-white text-6xl font-bold tracking-widest">
            {TIPO_LABEL[imovel.tipo]?.[0] ?? 'F'}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 rounded text-xs font-semibold bg-bg/90 text-fg">
            {TIPO_LABEL[imovel.tipo]}
          </span>
          {imovel.tag && (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${TAG_COLORS[imovel.tag] ?? 'bg-fg text-bg'}`}>
              {imovel.tag}
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-xs text-muted-fg mb-1">
            {imovel.logradouro ?? imovel.bairro}
            {imovel.complemento ? `, ${imovel.complemento}` : ''} · {imovel.cidade}/RS
          </p>
          <h3 className="font-semibold text-fg leading-snug line-clamp-2">{imovel.titulo}</h3>
        </div>

        {/* Atributos */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-fg">
          <span title="Área total">⬡ {formatArea(imovel.area_total)}</span>
          {imovel.quartos   != null && <span title="Quartos">🛏 {imovel.quartos} qto{imovel.quartos !== 1 ? 's' : ''}</span>}
          {imovel.banheiros != null && <span title="Banheiros">🚿 {imovel.banheiros} ban{imovel.banheiros !== 1 ? 'hs' : 'ho'}</span>}
          {imovel.vagas     != null && <span title="Vagas">🚗 {imovel.vagas} vaga{imovel.vagas !== 1 ? 's' : ''}</span>}
        </div>

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
          <span className="font-bold text-lg text-fg">{formatPreco(imovel.preco)}</span>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-accent text-accent-fg hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <WppIcon size={12} /> Consultar
          </a>
        </div>
      </div>
    </div>
  )
}
