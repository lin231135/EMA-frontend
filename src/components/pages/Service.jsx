// src/components/pages/Service.jsx

/**
 * Service.jsx
 * 
 * Muestra información sobre los diferentes servicios ofrecidos:
 * - Estimulación Musical
 * - Piano
 * - Entrenamiento Vocal (Canto)
 */

import { Card } from "flowbite-react";
import { useAuth } from "../../contexts/AuthContext";
import { PageLayout } from "../layout";
import translations from "../../translations";
import ServiceImageCarousel from "../ui/ServiceImageCarousel";

/**
 * ServiceBlock - Componente reutilizable para mostrar un servicio individual
 * 
 * Diseño de dos columnas (responsive):
 * - Columna 1: Título, descripción y bullets (lista de características)
 * - Columna 2: Imagen única o carrusel de imágenes
 * 
 * @param {string} title - Título del servicio (ej: "Piano")
 * @param {string} description - Descripción detallada del servicio
 * @param {string[]} bullets - Array de puntos destacados del servicio
 * @param {string} img - URL de imagen única (si no hay carrusel)
 * @param {string[]} images - Array de URLs para el carrusel (prioridad sobre img)
 * @param {boolean} reverse - Si true, invierte el orden de columnas (imagen a la izquierda)
 * @param {string} ctaLabel - Etiqueta para botón de acción (actualmente no usado, reservado)
 * 
 * @returns {JSX.Element} Card con el servicio formateado
 */
function ServiceBlock({
  title = "",
  description = "",
  bullets = [],
  img,           // imagen única (fallback si no hay carrusel)
  images = [],   // varias imágenes para carrusel (tiene prioridad sobre img)
  reverse = false,
  ctaLabel = "", // reservado para futura implementación de botón CTA
}) {
  // Determina si debe mostrar carrusel o imagen estática
  const hasCarousel = Array.isArray(images) && images.length > 0;
  
  // Filtra bullets vacíos o undefined para evitar <li> vacíos
  const safeBullets = Array.isArray(bullets) ? bullets.filter(Boolean) : [];

  return (
    <Card className="border border-gray-200/60 shadow-md overflow-hidden">
      <div
        className={[
          "flex flex-col items-center gap-6 md:gap-10",
          reverse ? "md:flex-row-reverse" : "md:flex-row",
        ].join(" ")}
      >
        {/* Texto */}
        <div className="w-full md:w-1/2 space-y-4 px-2 md:px-0">
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>

          {description ? (
            <p className="text-gray-600 leading-relaxed">{description}</p>
          ) : null}

          {safeBullets.length > 0 && (
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {safeBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Imagen o Carrusel */}
        <div className="w-full md:w-1/2">
          {hasCarousel ? (
            <ServiceImageCarousel
              images={images}
              alt={title || ""}
              heightClass="h-52 sm:h-64 md:h-56 lg:h-64 xl:h-72"
            />
          ) : (
            <img
              src={img}
              alt={title || ""}
              className="w-full h-52 sm:h-64 md:h-56 lg:h-64 xl:h-72 object-cover rounded-xl"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Service - Componente principal de la página de servicios
 * 
 * Gestiona:
 * - Obtención de traducciones según el idioma activo
 * - Arrays de imágenes para cada servicio (almacenadas en /public/Service/)
 * - Renderizado de hero section con título y subtítulo
 * - Tres bloques de servicios con información y carruseles
 * 
 * @returns {JSX.Element} Página completa de servicios dentro de PageLayout
 */
export default function Service() {
  // Hook para obtener el idioma actual del contexto de autenticación
  const { lang } = useAuth();

  // Obtención de traducciones siguiendo el patrón de About.jsx:
  // 1) Tomamos el diccionario del idioma activo para la sección 'service'
  // 2) Extraemos sub-objetos 'common' (textos compartidos) y 'services' (textos específicos)
  const t = translations[lang]?.service || {};
  const tc = t.common || {};     // Textos comunes: service, serviceSubtitle, moreInfo
  const ts = t.services || {};   // Textos de servicios: stimulationTitle, pianoDesc, etc.

  // Textos del hero section (banner principal con imagen de fondo)
  const pageTitle = tc.service || "";
  const pageSubtitle = tc.serviceSubtitle || "";

  // === Arrays de imágenes para carruseles ===
  // NOTA: Estas rutas con "/" apuntan a archivos en /public/Service/
  // El carrusel rotará automáticamente entre estas imágenes
  
  // Imágenes para Estimulación Musical
  const stimulationImgs = [
    "/Service/EstMusical/RecitalDiciembre.jpg",
    "/Service/EstMusical/Est1.jpg",
    "/Service/EstMusical/Est2.jpg",
    "/Service/EstMusical/Est3.jpg",
    "/Service/EstMusical/Est4.jpg",
  ];

  // Imágenes para Piano
  const pianoImgs = [
    "/Service/Piano/fotoPiano.jpg",
    "/Service/Piano/fotoPiano2.jpg",
    "/Service/Piano/fotoPiano3.jpg",
    "/Service/Piano/fotoPiano4.jpg",
    "/Service/Piano/fotoPiano5.jpg",
    "/Service/Piano/fotoPiano6.jpg",
    "/Service/Piano/fotoPiano7.jpg",
    "/Service/Piano/fotoPiano8.jpg",
    "/Service/Piano/fotoPiano9.jpg",
    "/Service/Piano/fotoPiano10.jpg",
    "/Service/Piano/fotoPiano11.jpg",
  ];

  // Imágenes para Entrenamiento Vocal (Canto)
  const cantoImgs = [
    "/Service/Canto/canto.png",
  ];

  return (
    <PageLayout>
      {/* === HERO SECTION === */}
      {/* Banner principal con imagen de fondo, título y subtítulo */}
      <section className="relative w-full">
        <div className="relative h-[220px] sm:h-[260px] md:h-[320px] w-full overflow-hidden rounded-none">
          {/* Imagen de fondo del hero */}
          <img
            src="/Service/Servicio.jpg"
            alt={pageTitle || ""}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          {/* Overlay oscuro para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Contenido del hero (título y subtítulo) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-white text-3xl sm:text-4xl font-bold drop-shadow">
              {pageTitle}
            </h1>
            <p className="mt-2 text-white/90 max-w-2xl text-sm sm:text-base">
              {pageSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* === CONTENIDO PRINCIPAL === */}
      {/* Sección con fondo gris claro que contiene los tres bloques de servicios */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          
          {/* === BLOQUE 1: ESTIMULACIÓN MUSICAL === */}
          {/* Layout normal: texto a la izquierda, carrusel a la derecha */}
          <ServiceBlock
            title={ts.stimulationTitle}              // Título del servicio
            description={ts.stimulationDesc}         // Descripción completa
            bullets={[ts.stimulationB1, ts.stimulationB2, ts.stimulationB3]} // Puntos destacados
            images={stimulationImgs}                 // Array de imágenes para carrusel
            reverse={false}                          // false = texto izq, imagen der
            ctaLabel={tc.moreInfo}                   // Etiqueta para botón (reservado)
          />

          {/* === BLOQUE 2: PIANO === */}
          {/* Layout invertido: carrusel a la izquierda, texto a la derecha */}
          <div className="mt-8 sm:mt-10">
            <ServiceBlock
              title={ts.pianoTitle}                  // Título del servicio
              description={ts.pianoDesc}             // Descripción completa
              bullets={[ts.pianoB1, ts.pianoB2, ts.pianoB3]} // Puntos destacados
              images={pianoImgs}                     // Array de 11 imágenes para carrusel
              reverse={true}                         // true = imagen izq, texto der (alternado)
              ctaLabel={tc.moreInfo}                 // Etiqueta para botón (reservado)
            />
          </div>

          {/* === BLOQUE 3: ENTRENAMIENTO VOCAL (CANTO) === */}
          {/* Layout normal: texto a la izquierda, imagen a la derecha */}
          <div className="mt-8 sm:mt-10">
            <ServiceBlock
              title={ts.singTitle}                   // Título del servicio
              description={ts.singDesc}              // Descripción completa
              bullets={[ts.singB1, ts.singB2, ts.singB3]} // Puntos destacados
              images={cantoImgs}                     // Array de imágenes (actualmente solo 1)
              reverse={false}                        // false = texto izq, imagen der
              ctaLabel={tc.moreInfo}                 // Etiqueta para botón (reservado)
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
