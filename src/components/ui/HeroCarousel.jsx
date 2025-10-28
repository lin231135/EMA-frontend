import { Carousel, Button } from "flowbite-react";

/**
 * HeroCarousel
 * - Recibe: slides (array con { title, subtitle, image, alt })
 * - Recibe opcional: onPrimary(), onSecondary() para CTAs
 * - Usa Flowbite React <Carousel /> con overlay y botones
 */
export default function HeroCarousel({
  slides = [],
  ctaPrimary = "Our Courses",
  ctaSecondary = "Exams",
  onPrimary = () => {},
  onSecondary = () => {},
}) {
  // Flechas SVG (blancas, con sombra)
  const leftArrow = (
    <svg
      className="w-8 h-8 text-white drop-shadow-lg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );

  const rightArrow = (
    <svg
      className="w-8 h-8 text-white drop-shadow-lg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );

  return (
    <div className="relative w-full h-[420px] sm:h-[520px] md:h-[560px] lg:h-[600px] rounded-2xl overflow-hidden">
      <Carousel
        leftControl={leftArrow}
        rightControl={rightArrow}
        className="h-full [&>div]:overflow-hidden" 
        slideInterval={6000}
        indicators
      >
        {slides.map((s, idx) => (
          <div key={idx} className="relative h-full w-full">
            {/* Imagen */}
            <img
              src={s.image}
              alt={s.alt || ""}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />

            {/* Capa azul translúcida para contraste del texto */}
            <div className="absolute inset-0 bg-blue-500/40 mix-blend-multiply" />

            {/* Contenido */}
            <div className="relative z-10 h-full w-full flex items-center">
              <div className="mx-auto w-11/12 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Texto */}
                <div className="text-white">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-md">
                    {s.title}
                  </h1>
                  <p className="mt-4 text-lg sm:text-xl opacity-95">{s.subtitle}</p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button pill onClick={onSecondary} color="light" className="text-gray-900">
                      {ctaSecondary}
                    </Button>
                    <Button pill onClick={onPrimary} className="bg-[#01A6CC] hover:bg-[#018bb0] text-white">
                      {ctaPrimary}
                    </Button>
                  </div>
                </div>

                {/* Marco de imagen decorativo (derecha) */}
                <div className="hidden md:block">
                  <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl overflow-hidden p-2">
                    <img
                      src={s.image}
                      alt={s.alt || ""}
                      className="h-[320px] w-full object-cover rounded-xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}