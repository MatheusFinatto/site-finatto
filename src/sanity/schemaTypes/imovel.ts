import { defineField, defineType, type Rule } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";
import { BrlNumberInput } from "../components/BrlNumberInput";

const noEdgeWhitespace = (r: Rule) =>
  r.custom<string | undefined>((v) =>
    !v || v === v.trim() ? true : "Remova espaços no início/fim.",
  );

export const imovelType = defineType({
  name: "imovel",
  title: "Imóvel",
  type: "document",
  groups: [
    { name: "info", title: "Informações" },
    { name: "detalhes", title: "Detalhes" },
    { name: "localizacao", title: "Localização" },
    { name: "midia", title: "Fotos" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      group: "info",
      validation: (r) => [r.required(), noEdgeWhitespace(r)],
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "info",
      options: { source: "titulo" },
      components: { input: AutoSlugInput },
      validation: (r) =>
        r.required().custom((slug) => {
          const v = slug?.current ?? "";
          if (!v) return true;
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)
            ? true
            : "Slug deve conter apenas minúsculas, números e hífens (sem espaços ou acentos).";
        }),
    }),
    defineField({
      name: "tipo",
      title: "Tipo",
      type: "string",
      group: "info",
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
      group: "info",
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
      group: "info",
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
      group: "info",
      description: "Use vírgula ou ponto. Ex: 480000 ou 480.000,00",
      components: { input: BrlNumberInput },
      validation: (r) => r.required().positive(),
    }),

    // ── Detalhes ─────────────────────────────────────────────────────────────
    defineField({
      name: "area_total",
      title: "Área total (m²)",
      type: "number",
      group: "detalhes",
      description: "Use vírgula ou ponto p/ decimais. Ex: 316,49",
      components: { input: BrlNumberInput },
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "area_construida",
      title: "Área construída (m²)",
      type: "number",
      group: "detalhes",
      description: "Use vírgula ou ponto p/ decimais. Ex: 235,94",
      components: { input: BrlNumberInput },
    }),
    defineField({
      name: "quartos",
      title: "Quartos",
      type: "number",
      group: "detalhes",
    }),
    defineField({
      name: "banheiros",
      title: "Banheiros",
      type: "number",
      group: "detalhes",
    }),
    defineField({
      name: "vagas",
      title: "Vagas de garagem",
      type: "number",
      group: "detalhes",
    }),
    defineField({
      name: "descricao",
      title: "Descrição",
      type: "text",
      rows: 4,
      group: "detalhes",
      validation: (r) => r.required(),
    }),

    // ── Localização ──────────────────────────────────────────────────────────
    defineField({
      name: "cidade",
      title: "Cidade",
      type: "string",
      group: "localizacao",
      initialValue: "Erechim",
      validation: (r) => [r.required(), noEdgeWhitespace(r)],
    }),
    defineField({
      name: "bairro",
      title: "Bairro",
      type: "string",
      group: "localizacao",
      validation: (r) => [r.required(), noEdgeWhitespace(r)],
    }),
    defineField({
      name: "logradouro",
      title: "Logradouro (rua ou comunidade)",
      type: "string",
      group: "localizacao",
      validation: (r) => noEdgeWhitespace(r),
    }),
    defineField({
      name: "complemento",
      title: "Complemento",
      type: "string",
      group: "localizacao",
      validation: (r) => noEdgeWhitespace(r),
    }),

    // ── Fotos ────────────────────────────────────────────────────────────────
    defineField({
      name: "fotos",
      title: "Fotos",
      type: "array",
      group: "midia",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Descrição da foto",
              type: "string",
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
