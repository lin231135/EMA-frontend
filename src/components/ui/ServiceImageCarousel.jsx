// src/components/ui/ServiceImageCarousel.jsx
import { useEffect, useRef, useState } from "react";

/**
 * ServiceImageCarousel
 * Carrusel compacto solo para imágenes (sin títulos/CTAs).
 * - images: array de rutas (ej. ["/img1.jpg", "/img2.jpg"])
 * - alt: texto base para el atributo alt
 * - heightClass: tailwind para la altura responsiva
 * - slideInterval: tiempo en ms entre slides
 *
 * Esta implementación: autoplay, pausa on hover, sin flechas, con indicadores (dots).
 */
export default function ServiceImageCarousel({
  images = [],
  alt = "Imagen de servicio",
  heightClass = "h-52 sm:h-64 md:h-56 lg:h-64 xl:h-72",
  roundedClass = "rounded-xl",
  slideInterval = 3500,
}) {
  if (!images?.length) return null;

  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => (imagesRef.current.length ? (i + 1) % imagesRef.current.length : 0));
    }, slideInterval);
    return () => clearInterval(id);
  }, [slideInterval]);

  return (
    <div
      className={`w-full ${heightClass} relative ${roundedClass} overflow-hidden`}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 w-full h-full flex items-center justify-center bg-white dark:bg-white transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={src}
            alt={`${alt} ${i + 1}`}
            className="max-w-full max-h-full object-contain"
            loading={i === index ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Indicators (dots) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir a la imagen ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-colors duration-150 ${
                i === index ? "bg-white" : "bg-white"
              }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
