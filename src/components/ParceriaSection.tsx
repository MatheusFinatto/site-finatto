import { WHATSAPP_FINATTO, whatsappLink } from '@/lib/utils'

export default function ParceriaSection() {
  const waLink = whatsappLink(
    WHATSAPP_FINATTO,
    'Olá! Tenho uma área e gostaria de conversar sobre a possibilidade de um loteamento.'
  )

  return (
    <section
      id="loteamentos"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-muted border-y border-border"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-4">
          Parceria · Loteamentos
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-fg mb-4">
          Tem uma área? Transformamos em loteamento.
        </h2>
        <p className="text-muted-fg text-lg max-w-2xl mx-auto mb-8">
          Fazemos estudo de viabilidade, projeto urbanístico, regularização e
          acompanhamento técnico completo, da ideia à entrega dos lotes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          {[
            'Estudo de viabilidade',
            'Projeto urbanístico',
            'Regularização completa',
            'Acompanhamento técnico',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-muted-fg">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              {item}
            </div>
          ))}
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 transition-opacity"
        >
          Falar sobre minha área
        </a>
      </div>
    </section>
  )
}
