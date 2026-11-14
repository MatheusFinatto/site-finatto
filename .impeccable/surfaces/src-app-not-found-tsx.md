---
version: 1
slug: "src-app-not-found-tsx"
primary_target: "src/app/not-found.tsx"
related_targets: []
---

Scope: página 404 do site (src/app/not-found.tsx). Visitor mode: Persuade (o visitante decide o próximo passo e age).
Audience/job: quem caiu num link quebrado ou num imóvel despublicado; precisa voltar ao catálogo ou falar com os sócios em segundos.
Constraints: mundo visual do site inalterado (papel --bg, verdes, Bricolage + Figtree); números reais do catálogo; nada de claims inventados.

## Direction contract

THESIS: o endereço pedido é um lote que não existe na prancha de loteamento; recusa o 404 padrão (ícone + "página não encontrada" + botão centralizado).
OWN-WORLD: prancha técnica em traço verde-escuro fino sobre o papel do site, grade milimetrada leve, lotes como retângulos com cota, lote vazio tracejado em verde, carimbo de prancha no canto; títulos em Bricolage, rótulos em Figtree.
STORY: o visitante entende que aquele endereço não existe, vê que o catálogo existe e está organizado por tipo com contagens reais, e clica num lote (tipo) ou no botão principal / WhatsApp.
FIRST VIEWPORT: desktop 1440: coluna esquerda com título grande "Este endereço não está na planta.", texto curto, botões "Ver imóveis à venda" (primário) e "Falar com os sócios"; coluna direita (maior) com a prancha: fileira de cima com lotes por tipo dimensionados pela contagem real e o lote 404 tracejado no meio, "Rua sem saída" cruzando, fileira de baixo com os demais tipos, carimbo com CREA/RS da responsável técnica. Celular: texto e botões primeiro, prancha abaixo em duas colunas.
FORM: planta de loteamento, posição 4 da lista; seed:bec4816275c6bbe9. Interação assinatura: a prancha "é plotada" ao abrir (lotes surgem traçados em sequência, o 404 por último), cada lote é link para a lista filtrada com hover que preenche o lote de verde-claro.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance


## Decisões do dono (substituem o contrato acima onde divergem)

- Texto sem vocabulário de construtora: título "Seu próximo imóvel está em outro endereço."; link de imóvel inexistente: "Este imóvel saiu do catálogo.", tipo deduzido do slug marcado na prancha, WhatsApp com o link.
- Sem carimbo de prancha nem "Resp. técnica".
- Lotes de largura constante (não proporcional à quantidade).
- Número "404" com o último 4 tombado e loop do martelo (Fluent Emoji, MIT) com "!" em volta do martelo; ciclo em --num404-ciclo (3,5s); sem botão de pausa; movimento reduzido mostra o 404 inteiro.
- Ícones dos lotes: Phosphor light (MIT) tingidos de verde.
