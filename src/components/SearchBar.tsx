'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const tipos = [
  { value: '', label: 'Todos os tipos' },
  { value: 'chacara', label: 'Chácara' },
  { value: 'casa', label: 'Casa' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'pavilhao', label: 'Pavilhão' },
]

export default function SearchBar() {
  const [tipo, setTipo] = useState('')
  const router = useRouter()

  function handleBuscar() {
    const params = new URLSearchParams()
    if (tipo) params.set('tipo', tipo)
    const query = params.toString()
    router.push(`/#imoveis${query ? `?${query}` : ''}`)

    // Dispatch event so ImovelGrid can react without full nav
    window.dispatchEvent(new CustomEvent('filtro-imoveis', { detail: { tipo } }))

    document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-bg/10 backdrop-blur-sm border border-bg/20 rounded-xl p-3">
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg bg-bg text-fg text-sm font-medium border border-border focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
      >
        {tipos.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleBuscar}
        className="px-8 py-3 rounded-lg bg-accent text-accent-fg font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Buscar imóveis
      </button>
    </div>
  )
}
