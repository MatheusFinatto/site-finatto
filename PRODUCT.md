# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pessoas de Erechim e região (norte do RS) procurando chácara, casa, terreno, apartamento ou pavilhão para comprar. Chegam pela busca, por link compartilhado no WhatsApp ou por anúncio, olham fotos, localização e preço, e decidem se vale conversar.

## Product Purpose

Site institucional e catálogo de imóveis da Finatto Incorporadora e Engenharia. O sucesso é o visitante iniciar uma conversa no WhatsApp direto com os sócios sobre um imóvel (ou sobre o que procura).

## Positioning

- Avaliação técnica de engenheira civil em cada imóvel.
- O cliente fala direto com os sócios, sem intermediário.
- Em Erechim desde 2006; 500+ imóveis entregues; 13 anos como construtora antes de virar incorporadora. CRECI/RS 51910 · CREA/RS 242604.

## Operating Context

- Imóveis, fotos e textos são cadastrados pelos sócios no Sanity Studio embutido em `/studio`; o site revalida a cada 60s.
- Status de imóvel: `disponivel`, `reservado`, `vendido`. Imóvel despublicado some do catálogo.
- Contato acontece no WhatsApp (dois números: Finatto e Flávia), com mensagens pré-preenchidas por imóvel.
- Fotos do portfólio são tiradas no celular pelos sócios (marca "Galaxy S20 FE" no canto); não há fotógrafo profissional.

## Capabilities and Constraints

- Next.js 16 (App Router) + Sanity, hospedado na Vercel. Imagens do Sanity via loader próprio; imagens locais passam pelo otimizador (transformações cobradas, por isso poucas variantes).
- Imóvel vendido: a página continua existindo e indexada, mostrando que foi vendido (foto, título, local, sem preço) e oferecendo imóveis parecidos à venda e um caminho para todo o catálogo.
- Imóvel despublicado ou endereço inexistente: página 404.

## Brand Commitments

- Nome: Finatto Incorporadora e Engenharia.
- Voz: português direto, sem jargão de corretagem; fala de "sócios", "chácara", "terreno", "Erechim e região".

## Evidence on Hand

- Catálogo real de ~36–40 imóveis no Sanity, com fotos próprias.
- Números institucionais em `src/lib/constants.ts` (ano de fundação, imóveis entregues, anos como construtora).
- Não há depoimentos de clientes cadastrados; não inventar.

## Product Principles

1. Todo caminho termina numa conversa com os sócios no WhatsApp.
2. Nunca deixar o visitante num beco sem saída: imóvel vendido ou página inexistente sempre oferecem o próximo passo.
3. Mostrar o imóvel real com fotos reais; nada de imagem genérica de banco.
4. Credibilidade técnica (engenharia) e proximidade (sócios) aparecem antes de qualquer apelo de venda.
