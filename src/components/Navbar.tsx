'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { WHATSAPP_FINATTO, whatsappLink } from '@/lib/utils'

const links = [
  { href: '#imoveis', label: 'Imóveis' },
  { href: '#loteamentos', label: 'Loteamentos' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-sm border-b border-border"
      style={{ backgroundColor: 'var(--nav-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/img/logo-light.jpeg"
              alt="Finatto Incorporadora e Engenharia"
              width={160}
              height={40}
              className="logo-light-img h-9 w-auto object-contain"
              priority
            />
            <Image
              src="/img/logo-dark.jpeg"
              alt="Finatto Incorporadora e Engenharia"
              width={160}
              height={40}
              className="logo-dark-img h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-fg hover:text-fg transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <ThemeToggle />
            <a
              href={whatsappLink(WHATSAPP_FINATTO, 'Olá! Gostaria de informações sobre imóveis.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md text-sm font-semibold bg-accent text-accent-fg hover:opacity-90 transition-opacity"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="p-2 rounded-md text-muted-fg hover:text-fg"
            >
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border py-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-fg hover:text-fg transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={whatsappLink(WHATSAPP_FINATTO, 'Olá! Gostaria de informações sobre imóveis.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md text-sm font-semibold bg-accent text-accent-fg hover:opacity-90 transition-opacity text-center"
            >
              WhatsApp
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
