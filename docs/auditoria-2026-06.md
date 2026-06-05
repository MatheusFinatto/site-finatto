# Auditoria do site — junho/2026

Auditoria sênior do site Finatto (Next.js 16 + Sanity, App Router, Vercel).
Data: 2026-06-05. Escopo: correção, segurança, SEO, performance, acessibilidade,
CMS/integridade de dados, infra/observabilidade.

Método: leitura arquivo-a-arquivo de todo o `src/`, gates automáticos
(`next build`, `tsc`, `eslint`, `npm audit`), e checagem dos dados ao vivo no
dataset `production` (36 imóveis). Severidade: **P0** quebrado/segurança crítica ·
**P1** impacto material · **P2** qualidade/polish · **P3** higiene.

## Resumo

Base de código **boa** para origem 100% gerada por IA: tipada, organizada, camada
de CMS bem pensada (inputs custom de área m²/ha, confirmação de publish, slug
único). O que separava de "top-tier": **1 bug que quebrava o build**, performance
de imagens, e polish de SEO/acessibilidade. A maioria já foi corrigida nesta
rodada.

Dados ao vivo (36 imóveis publicados):
- ✅ Slug: 100% preenchido. Campos obrigatórios: 100% completos.
- ⚠️ **0% das fotos têm `alt`** (centenas de imagens) — ver P1-ALT.
- ⚠️ 1 imóvel com `area_construida > area_total` (impossível) — corrigido por validação.

## Findings e status

| # | Dim | Severidade | Status | Item |
|---|-----|-----------|--------|------|
| BUILD | Correção | **P0** | ✅ corrigido | `imovel.ts` usava `__experimental_formPreviewTitle` (chave inválida) → `next build` falhava no type-check. Removido. |
| SORT | Correção | **P0** | ✅ corrigido | Ordenação "mais antigos/novos" comparava `Number(_id)` (string não-numérica) = `NaN`; "mais antigos" nunca invertia. Agora ordena por `_createdAt` (`createdAt` adicionado à query e ao tipo). |
| XSS | Segurança | P1 | ✅ corrigido | JSON-LD via `JSON.stringify` não escapava `<>&` → breakout de `</script>` por conteúdo do CMS. Novo helper `jsonLdSafe()` escapa em `\uXXXX`. Aplicado em `layout` e `[slug]`. |
| HEADERS | Segurança | P1 | ✅ corrigido | Sem headers de segurança. Adicionados em `next.config.ts`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS`. |
| CANONICAL | SEO | P1 | ✅ corrigido | Nenhuma tag canonical. Adicionado `alternates.canonical` na home (`/`) e em cada imóvel (`/imoveis/<slug>`). |
| SITEMAP | SEO | P2 | ✅ corrigido | `lastModified` usava timestamp do build; agora usa `_updatedAt` real de cada doc. |
| ROBOTS | SEO | P2 | ✅ corrigido | `/studio` era indexável; adicionado `disallow: /studio`. |
| OG | SEO | P2 | ✅ corrigido | Imagens OG sem `height`; adicionado. OG do imóvel agora servida redimensionada. |
| IMG | Performance | P1 | ✅ corrigido | Imagens serviam o original full-res (`asset->url` cru). Novo helper `sanityImg(url,w)` aplica `?w=&q=&auto=format&fit=max`. Aplicado em thumb da lista (CSS bg), cards de destaque e carrossel do detalhe. |
| THEME | a11y/Correção | P1 | ✅ corrigido | `ThemeToggle` chamava `setState` dentro de effect (erro de lint, render em cascata). Reescrito com `useSyncExternalStore` lendo `data-theme`. |
| MOTION | a11y | P2 | ✅ corrigido | Marquee/transições ignoravam `prefers-reduced-motion`. Adicionado bloco `@media (prefers-reduced-motion: reduce)`. |
| SELECT | a11y | P1 | ✅ parcial | `FilterSelect` (dropdown custom) era só mouse. Adicionado `Escape`, `aria-haspopup`, `aria-expanded`, `role=listbox/option`, `aria-selected`. **Falta:** navegação por setas ↑↓ (backlog). |
| AREA | CMS | P1 | ✅ corrigido | Sem regra impedindo `area_construida > area_total` (1 caso real nos dados). Validação cross-field adicionada ao schema. |
| 404 | UX/infra | P2 | ✅ corrigido | Sem página 404 customizada. Criada `not-found.tsx` com a identidade visual (DM Serif, verde accent, gradiente das chácaras, CTAs WhatsApp). |
| DEPS-DEAD | Performance | P2 | ✅ corrigido | `styled-components` era dependência mas não usada. Removida. |
| ANALYTICS | Observabilidade | P2 | ✅ corrigido | Sem analytics. Adicionados `@vercel/analytics` + `@vercel/speed-insights` no layout. |
| NODE | Infra | P3 | ✅ corrigido | Sem pin de Node. `engines.node >=20.9.0`. |
| LINT | Qualidade | P3 | ✅ corrigido | `prefer-const` em `migrate-slugs.ts`; imports mortos (`Link`, `ArrowLeft`) em `[slug]/page.tsx`. |
| DOCS | Higiene | P3 | ✅ corrigido | README dizia "Next.js 15"; `CLAUDE.md` dizia fundação 2008. Ambos corrigidos (16 / 2006). |
| AUDIT-FIX | Segurança | P2 | ➖ parcial | `npm audit fix` aplicado (subiu next 16.2.6→16.2.7). Restam 21 vulns moderadas transitivas do toolchain Sanity (`ws`, `uuid`) — só corrigíveis com `--force` (quebra Sanity). Sem superfície de ataque em runtime. |

## Backlog (não feito nesta rodada)

- **P1-ALT — alt das fotos (3 partes):** (a) query descarta `alt` (`fotos[...].asset->url`); mudar para `{ "url": asset->url, alt }` exige mudar `Imovel.fotos` de `string[]` para `{url,alt}[]` e ajustar todos os consumidores; (b) tornar `alt` recomendado/obrigatório no schema; (c) **backfill** das centenas de fotos existentes (todas sem alt hoje). Como o `alt` gerado (`"título — foto N"`) já cobre o básico, priorizei outras coisas. Decisão sua se vale o refactor + backfill.
- **P2 — consolidar carrosséis:** Swiper (Destaques) + Embla (detalhe/cards) ao mesmo tempo. Migrar tudo para Embla reduz bundle.
- **P2 — `FilterSelect` setas ↑↓** para navegação completa por teclado.
- **P2 — CSP:** não adicionada por causa do Studio embutido + scripts inline (tema/JSON-LD). Requer nonces ou política escopada por rota. Follow-up dedicado.
- **P3 — bumps maiores:** `next-sanity` 12→13, `typescript` 5→6, `eslint` 9→10 (majors, testar à parte).
- **Search Console:** verificação via `metadata.verification.google` (preciso do token do GSC) ou registro DNS. `@vercel/analytics` já cobre tráfego; Speed Insights cobre Core Web Vitals.

## Revisão do diff (workflow, 4 lentes + síntese)

Veredito: **SAFE TO SHIP — zero P0/P1, sem regressões.** Fixes centrais confirmados
corretos (jsonLdSafe fecha o breakout de `</script>`; sort por `_createdAt`;
headers válidos p/ Next 16; canonical/robots/sitemap ok; `useSyncExternalStore`
correto; validação Sanity v5 `.custom()` válida; imports removidos sem órfãos).

Ajustes de follow-up aplicados (2º commit):
- **OG (P2):** detalhe declarava `height:630` mas `sanityImg`/`fit=max` não cortava
  → `og:image:height` incorreto. Novo `sanityImgCrop()` (1200×630, `fit=crop`).
- **Thumb retina (P3):** `sanityImg(...,400)` borrava no mobile (slot full-width).
  Subido para 800.
- **ThemeToggle (P3):** o listener de `matchMedia` era inerte (snapshot lê
  `data-theme`, não atualizado). Agora segue o tema do SO quando não há
  preferência salva.
- **/studio (P3):** `robots.ts` bloqueia crawl, mas faltava `noindex`. Adicionado
  `robots:{index:false,follow:false}` no metadata do Studio (defesa em profundidade).

Mantidos no backlog (P3, decisão sua): setas ↑↓ no `FilterSelect`, validação de
área bidirecional.

## Gates após correções

- `next build`: ✅ exit 0 (Next 16.2.7), 44 páginas, type-check limpo.
- `tsc --noEmit`: ✅ limpo.
- `eslint`: ✅ limpo.
