import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "yaptv34k",
  dataset: "production",
  apiVersion: "2026-04-15",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function run() {
  const docs = await client.fetch<{ _id: string; titulo: string }[]>(
    `*[_type == "imovel" && !defined(slug.current)]{ _id, titulo }`,
  );

  if (docs.length === 0) {
    console.log("Nenhum imóvel sem slug.");
    return;
  }

  const existingSlugs = await client.fetch<string[]>(
    `*[_type == "imovel" && defined(slug.current)][].slug.current`,
  );
  const usedSlugs = new Set(existingSlugs);

  for (const doc of docs) {
    let base = slugify(doc.titulo);
    let slug = base;
    let n = 2;
    while (usedSlugs.has(slug)) {
      slug = `${base}-${n++}`;
    }
    usedSlugs.add(slug);

    await client.patch(doc._id).set({ slug: { _type: "slug", current: slug } }).commit();
    console.log(`✓ ${doc.titulo} → ${slug}`);
  }

  console.log(`\nMigração concluída: ${docs.length} imóvel(is) atualizados.`);
}

run().catch(console.error);
