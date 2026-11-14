---
version: 1
slug: "src-components-imovelvendido-tsx"
primary_target: "src/components/ImovelVendido.tsx"
related_targets: ["src/app/imoveis/[slug]/page.tsx"]
---

Scope: estado "vendido" da página do imóvel (/imoveis/<slug> com status vendido), extensão da página existente. Visitor mode: Persuade.
Audience/job: quem chega por link antigo/compartilhado de um imóvel já vendido; precisa entender rápido que foi vendido e seguir para imóveis parecidos à venda ou pedir aos sócios algo parecido.
Constraints: herda a composição e o mundo da página do imóvel; mostra foto, título e local (sem preço); página continua indexada.

## Direction contract

THESIS: a placa "FINATTO VENDE" do lote com a tarja "VENDIDO" colada por cima, como se faz na rua; recusa o selo cinza "vendido" sobre a página normal.
OWN-WORLD: a mesma página do imóvel (papel, verdes, Bricolage/Figtree); a placa é uma peça verde da marca com letras brancas, a tarja é uma faixa vermelha com letras brancas em diagonal, levemente desalinhada como adesivo.
STORY: o visitante vê a foto do imóvel com a placa cravada e a tarja VENDIDO, lê que foi vendido pela Finatto, e vai para os parecidos à venda logo abaixo ou pede pelo WhatsApp.
FIRST VIEWPORT: foto principal do imóvel em faixa larga, a placa no canto inferior esquerdo sobre a foto; abaixo, título "Este imóvel foi vendido.", nome e local do imóvel, botões "Ver imóveis à venda" e "Pedir um parecido" (WhatsApp); em seguida a fileira de parecidos.
FORM: extensão de superfície existente, sem rodada; seed: none (pinned) — escolhido pelo usuário: "Tarja VENDIDO na placa".
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance


## Decisões do dono (substituem o contrato acima onde divergem)

- Nada de placa realista (vale da estranheza): selo gráfico chapado e assumido no canto da foto, sem estacas, sombra, hover ou link; marca Finatto + "VENDE" com a tarja VENDIDO por cima, topo e base de "VENDE" aparecendo.
- Título "Este imóvel já encontrou um dono." ("Vendido pela Finatto." foi vetado por soar prepotente). Sem autopromoção no texto.
- WhatsApp "Pedir um parecido" é a ação principal; barra Voltar/trilha/Compartilhar igual à página normal; parecidos e fecho "Não achou?".
- Na lista, card de imóvel vendido com faixa diagonal vermelha "VENDIDO" no canto, foto dessaturada e sem preço.
