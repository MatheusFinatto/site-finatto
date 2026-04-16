'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  fotos: string[]
  alt: string
}

export default function FotoCarrossel({ fotos, alt }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ])

  const [current, setCurrent] = useState(0)

  const stopAutoplay = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.stop()
  }, [emblaApi])

  const scrollPrev = useCallback(() => { emblaApi?.scrollPrev(); stopAutoplay() }, [emblaApi, stopAutoplay])
  const scrollNext = useCallback(() => { emblaApi?.scrollNext(); stopAutoplay() }, [emblaApi, stopAutoplay])
  const scrollTo   = useCallback((i: number) => { emblaApi?.scrollTo(i); stopAutoplay() }, [emblaApi, stopAutoplay])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  if (fotos.length === 0) return null

  return (
    <div className="relative w-full" style={{ height: 'clamp(280px, 45vw, 560px)' }}>
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden w-full h-full">
        <div className="flex h-full">
          {fotos.map((url, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 h-full relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`${alt} — foto ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows — só aparecem se mais de 1 foto */}
      {fotos.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Foto anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
            style={{ background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer', width: 40, height: 40, zIndex: 2 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            aria-label="Próxima foto"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
            style={{ background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer', width: 40, height: 40, zIndex: 2 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 2 }}>
            {fotos.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Ir para foto ${i + 1}`}
                style={{
                  width: i === current ? 20 : 8,
                  height: 8,
                  background: i === current ? 'white' : 'rgba(255,255,255,0.45)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <span
            className="absolute top-4 right-4 font-medium"
            style={{ fontSize: 12, color: 'white', background: 'rgba(0,0,0,0.45)', padding: '4px 10px', zIndex: 2 }}
          >
            {current + 1} / {fotos.length}
          </span>
        </>
      )}
    </div>
  )
}
