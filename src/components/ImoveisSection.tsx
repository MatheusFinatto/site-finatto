'use client'

import { useEffect, useState } from 'react'
import { Imovel, TipoImovel } from '@/lib/types'
import ImovelRow from './ImovelRow'

const tabs: { value: TipoImovel | ''; label: string }[] = [
  { value: '',        label: 'Todos' },
  { value: 'chacara', label: 'Chácaras' },
  { value: 'casa',    label: 'Casas' },
  { value: 'terreno', label: 'Terrenos' },
  { value: 'pavilhao',label: 'Pavilhões' },
]

interface Props { imoveis: Imovel[] }

export default function ImoveisSection({ imoveis }: Props) {
  const [filtro, setFiltro] = useState<TipoImovel | ''>('')

  useEffect(() => {
    function handleFiltro(e: Event) {
      setFiltro(((e as CustomEvent).detail?.tipo || '') as TipoImovel | '')
    }
    window.addEventListener('filtro-imoveis', handleFiltro)
    return () => window.removeEventListener('filtro-imoveis', handleFiltro)
  }, [])

  const filtrados = filtro ? imoveis.filter((i) => i.tipo === filtro) : imoveis

  return (
    <section id="imoveis" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 60px)' }}>
      {/* Header */}
      <div
        className="flex items-end justify-between border-b border-border"
        style={{ marginBottom: 0, paddingBottom: 24 }}
      >
        <div>
          <p
            className="text-accent uppercase flex items-center gap-2"
            style={{ fontSize: 11, letterSpacing: 3, marginBottom: 8 }}
          >
            <span className="inline-block bg-accent" style={{ width: 24, height: 1.5 }} />
            Portfólio
          </p>
          <h2
            className="text-fg"
            style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 400 }}
          >
            Imóveis disponíveis
          </h2>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 self-end"
          style={{ background: 'var(--muted)', padding: 4 }}
        >
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setFiltro(t.value)}
              className="font-medium uppercase transition-all"
              style={{
                padding: '8px 16px',
                fontSize: 12,
                letterSpacing: 1,
                color: filtro === t.value ? 'var(--fg)' : 'var(--muted-fg)',
                background: filtro === t.value ? 'var(--card)' : 'transparent',
                boxShadow: filtro === t.value ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {filtrados.length === 0 ? (
          <p className="text-muted-fg py-12 text-center">Nenhum imóvel encontrado.</p>
        ) : (
          filtrados.map((imovel) => (
            <ImovelRow key={imovel.id} imovel={imovel} />
          ))
        )}
      </div>

      {/* Count */}
      <p className="text-muted-fg mt-6 text-center" style={{ fontSize: 13 }}>
        {filtrados.length} imóve{filtrados.length !== 1 ? 'is' : 'l'} encontrado{filtrados.length !== 1 ? 's' : ''}
      </p>
    </section>
  )
}
