import { defineField, defineType } from "sanity";
import type { StringRule } from "sanity";
import { AreaInput } from "../components/AreaInput";
import { BrlNumberInput } from "../components/BrlNumberInput";
import { TrimmedStringInput } from "../components/TrimmedStringInput";

const noEdgeWhitespace = (r: StringRule) =>
  r.custom<string>((v) =>
    !v || v === v.trim() ? true : "Remova espaços no início/fim.",
  );

export const imovelType = defineType({
  name: "imovel",
  title: "Imóvel",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      components: { input: TrimmedStringInput },
      validation: (r) => [r.required(), noEdgeWhitespace(r)],
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      hidden: true,
      options: { source: "titulo" },
    }),
    defineField({
      name: "tipo",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Chácara", value: "chacara" },
          { title: "Casa", value: "casa" },
          { title: "Apartamento", value: "apartamento" },
          { title: "Terreno", value: "terreno" },
          { title: "Pavilhão", value: "pavilhao" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "disponivel",
      options: {
        list: [
          { title: "Disponível", value: "disponivel" },
          { title: "Reservado", value: "reservado" },
          { title: "Vendido", value: "vendido" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tag",
      title: "Tag (opcional)",
      type: "string",
      options: {
        list: [
          { title: "Destaque", value: "Destaque" },
          { title: "Oportunidade", value: "Oportunidade" },
          { title: "Última Unidade", value: "Última Unidade" },
        ],
      },
    }),
    defineField({
      name: "preco",
      title: "Preço (R$)",
      type: "number",
      description:
        "Use vírgula para casas decimais, e para separação de milhar use ponto ou nada.",
      components: { input: BrlNumberInput },
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "area_total",
      title: "Área total",
      type: "number",
      description:
        "Use vírgula para casas decimais, e para separação de milhar use ponto ou nada.",
      components: { input: AreaInput },
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "area_construida",
      title: "Área construída",
      type: "number",
      description:
        "Use vírgula para casas decimais, e para separação de milhar use ponto ou nada.",
      components: { input: AreaInput },
      validation: (r) =>
        r.positive().custom((value, ctx) => {
          const total = (ctx.document as { area_total?: number } | undefined)
            ?.area_total;
          if (
            typeof value === "number" &&
            typeof total === "number" &&
            value > total
          ) {
            return "Área construída não pode ser maior que a área total.";
          }
          return true;
        }),
    }),
    defineField({
      name: "quartos",
      title: "Quartos",
      type: "number",
    }),
    defineField({
      name: "banheiros",
      title: "Banheiros",
      type: "number",
    }),
    defineField({
      name: "vagas",
      title: "Vagas de garagem",
      type: "number",
    }),
    defineField({
      name: "descricao",
      title: "Descrição",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cidade",
      title: "Cidade",
      type: "string",
      initialValue: "Erechim",
      components: { input: TrimmedStringInput },
      validation: (r) => [r.required(), noEdgeWhitespace(r)],
    }),
    defineField({
      name: "bairro",
      title: "Bairro",
      type: "string",
      components: { input: TrimmedStringInput },
      validation: (r) => [r.required(), noEdgeWhitespace(r)],
    }),
    defineField({
      name: "logradouro",
      title: "Logradouro (rua ou comunidade)",
      type: "string",
      components: { input: TrimmedStringInput },
      validation: (r) => noEdgeWhitespace(r),
    }),
    defineField({
      name: "complemento",
      title: "Complemento",
      type: "string",
      components: { input: TrimmedStringInput },
      validation: (r) => noEdgeWhitespace(r),
    }),
    defineField({
      name: "lat",
      title: "Latitude (mapa)",
      type: "number",
      description:
        "Opcional. Para mostrar o mapa, pegue a coordenada DO PIN no Google Maps: " +
        "clique direito no ponto exato → clique nas coordenadas para copiar (ou copie " +
        "do trecho !3d{lat}!4d{lng} da URL — NÃO do @ inicial, que é o centro da tela, " +
        "não o pin). Latitude é o primeiro número. Sem lat/lng, o imóvel fica sem mapa.",
      validation: (r) =>
        r.min(-90).max(90).error("Latitude deve estar entre -90 e 90."),
    }),
    defineField({
      name: "lng",
      title: "Longitude (mapa)",
      type: "number",
      description:
        "Opcional. Longitude do mesmo pin (segundo número, o !4d da URL). " +
        "Preencha junto com a latitude — as duas são necessárias para o mapa.",
      validation: (r) =>
        r.min(-180).max(180).error("Longitude deve estar entre -180 e 180."),
    }),
    defineField({
      name: "fotos",
      title: "Fotos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Descrição da foto",
              type: "string",
              description:
                "Recomendado: descreva a foto (ex.: “varanda com vista para o vale”) — melhora SEO e leitores de tela.",
              validation: (r) =>
                r
                  .custom((value) =>
                    value
                      ? true
                      : "Recomendado descrever a foto para SEO e acessibilidade.",
                  )
                  .warning(),
            }),
          ],
        },
      ],
      options: { layout: "grid" },
    }),
  ],

  preview: {
    select: {
      title: "titulo",
      subtitle: "tipo",
      media: "fotos.0",
    },
    prepare({ title, subtitle, media }) {
      const tipos: Record<string, string> = {
        chacara: "Chácara",
        casa: "Casa",
        apartamento: "Apartamento",
        terreno: "Terreno",
        pavilhao: "Pavilhão",
      };
      return { title, subtitle: tipos[subtitle] ?? subtitle, media };
    },
  },
});
