import banner800 from '../assets/salinas-banner-800.webp'
import banner1600 from '../assets/salinas-banner-1600.webp'

export function SalinasBanner({ className = '' }: { className?: string }) {
  return (
    <figure className={`relative overflow-hidden bg-brand-deep ${className}`}>
      <img
        src={banner1600}
        srcSet={`${banner800} 800w, ${banner1600} 1600w`}
        sizes="(min-width: 1024px) 46vw, 100vw"
        width={1600}
        height={900}
        alt="Salinas da Margarida: aperto de mãos, vista da cidade à beira da baía e os pilares emprego, empreendedorismo, parcerias e crescimento."
        className="h-full w-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </figure>
  )
}
