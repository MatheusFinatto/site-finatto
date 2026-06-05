# Finatto Incorporadora e Engenharia — Site institucional

Production website for a real estate company based in Erechim, RS, Brazil. Live at [finattoincorporadora.com.br](https://finattoincorporadora.com.br/).

## Stack

- **Next.js 16** (App Router)
- **Sanity CMS** — property listings, team, and photos managed through embedded Sanity Studio at `/studio`
- **TypeScript**
- **Tailwind CSS**
- **Embla Carousel / Swiper** — photo galleries
- **Lucide React** — icons

## Features

- Property listing with filtering (type, status)
- Individual property pages with photo carousel
- Team section, CTA, partnership section, and animated marquee
- Dark / light mode (persisted via localStorage, no flash on load)
- WhatsApp floating button
- SEO: `sitemap.ts`, `robots.ts`, OpenGraph tags, JSON-LD structured data (`RealEstateAgent` + `LocalBusiness`)
- Embedded Sanity Studio at `/studio` so the client manages content without touching code

## Getting started

```bash
cd site
npm install
npm run dev
```

Requires a `.env.local` with your Sanity project credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
```

## Project structure

```
src/
  app/          # Next.js App Router pages
  components/   # UI components
  lib/          # Constants, helpers
  sanity/       # Sanity client, schema types, structure
```
