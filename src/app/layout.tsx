import type { Metadata } from 'next'
import { Space_Grotesk, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import WppFloat from '@/components/WppFloat'
import { BASE_URL, IMOVEIS_ENTREGUES, anosDeExperiencia } from '@/lib/constants'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const dmSerif = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
})

const description = `Encontre seu imóvel ideal em Erechim e região. Chácaras, casas, terrenos e pavilhões. ${anosDeExperiencia()} anos de mercado, ${IMOVEIS_ENTREGUES} imóveis entregues.`

export const metadata: Metadata = {
  title: 'Finatto Incorporadora e Engenharia | Erechim, RS',
  description,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Finatto Imóveis',
    title: 'Finatto Incorporadora e Engenharia | Erechim, RS',
    description,
    images: [{ url: '/img/hero-landscape.jpg', width: 1600, alt: 'Finatto Imóveis — Erechim, RS' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-fg">
        {children}
        <WppFloat />
      </body>
    </html>
  )
}
