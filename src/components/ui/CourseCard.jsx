// src/components/ui/CourseCard.jsx
import { Badge } from "flowbite-react";

/**
 * CourseCard (compact + animated)
 * - Misma info: name, modality, capacity, cost, selected.
 * - Estilo tipo RecitalCard compacto (16:9) con animaciones:
 *   • Hover: zoom suave del fondo + ligera escala y más sombra
 *   • Active (click): leve "press" (scale down)
 * - Click = onSelect(course).
 */
export default function CourseCard({
  course,
  selected = false,
  onSelect,
}) {
  if (!course) return null;

  const cover = pickCover(course);
  const title = course.name ?? "Curso";
  const modality = (course.modality ?? "").toString();
  const capacity = Number(course.capacity ?? 0);
  const cost = isFinite(Number(course.cost)) ? Number(course.cost).toFixed(2) : "0.00";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(course)}
      className={[
        "group relative block w-full overflow-hidden rounded-xl shadow transition",
        // Animación del contenedor (escala/sombra)
        "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
        "focus:outline-none focus:ring-2 focus:ring-indigo-400/80",
        selected
          ? "ring-2 ring-indigo-400/90 shadow-lg motion-safe:scale-[1.01]"
          : "hover:shadow-lg active:shadow md:hover:shadow-xl"
      ].join(" ")}
      // efecto scale en hover/active (solo si no está seleccionado, para no pelear con la escala del seleccionado)
      style={!selected ? { transform: "translateZ(0)" } : undefined}
      aria-label={`Seleccionar curso ${title}`}
    >
      {/* Imagen de fondo (más baja: 16:9) con zoom suave en hover */}
      <div
        className={[
          "aspect-[16/9] w-full bg-cover bg-center",
          "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out",
          "group-hover:scale-[1.03] group-active:scale-[1.005]"
        ].join(" ")}
        style={{ backgroundImage: `url(${cover})` }}
      />

      {/* Overlay degradado */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/60" />

      {/* Badge superior izquierda (modality) – tamaño reducido */}
      <div className="absolute left-3 top-3">
        <span className="inline-flex items-center rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-semibold text-slate-100 ring-1 ring-white/10 backdrop-blur">
          {capitalize(modality || "—")}
        </span>
      </div>

      {/* Check de seleccionado (esquina sup. derecha) – más pequeño */}
      {selected && (
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1 5.917 5.724 10.5 15 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Seleccionado
          </span>
        </div>
      )}

      {/* Texto principal (abajo izquierda) – tipografías/paddings reducidos */}
      <div
        className={[
          "absolute inset-x-3 bottom-3",
          // sutil desplazamiento hacia arriba al hover
          "motion-safe:transition-transform motion-safe:duration-200",
          "group-hover:-translate-y-0.5 group-active:translate-y-0"
        ].join(" ")}
      >
        <h3 className="text-white text-lg md:text-xl font-bold drop-shadow-sm leading-tight">
          {title}
        </h3>
        <p className="mt-0.5 text-slate-200/90 text-xs md:text-sm">
          Cap. {capacity} • Q{cost}
        </p>

        {/* Pill inferior (compacta) */}
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-slate-900/70 px-2.5 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/10 backdrop-blur">
            {capacity} {capacity === 1 ? "cupo" : "cupos"}
          </span>
        </div>
      </div>

      {/* Efecto "press" del botón (contenedor) cuando no está seleccionado */}
      {!selected && (
        <style>{`
          .group:active { transform: scale(0.995); }
          @media (prefers-reduced-motion: reduce) {
            .group, .group div { transition: none !important; }
          }
        `}</style>
      )}
    </button>
  );
}

/* ----------------- Utilidades ----------------- */

function capitalize(s = "") {
  try {
    return s.charAt(0).toUpperCase() + s.slice(1);
  } catch {
    return s;
  }
}

/**
 * Selecciona la imagen de portada para un curso
 * basándose en su nombre o propiedades
 */
function pickCover(course) {
  const fromObj =
    course?.coverUrl ||
    course?.image ||
    course?.cover ||
    "";

  if (fromObj) return fromObj;

  const name = (course?.name || "").toLowerCase();

  if (name.includes("piano")) {
    return "/Service/Piano/fotoPiano.jpg";
  }
  if (name.includes("canto") || name.includes("vocal") || name.includes("voz")) {
    return "/Service/Canto/Canto1.jpg";
  }
  if (name.includes("estimula") || name.includes("estimulación") || name.includes("musical")) {
    if (name.includes("n1") || name.includes("nivel 1") || name.includes("nivel1")) {
      return "/Service/EstMusical/Est1.jpg";
    } else if (name.includes("n2") || name.includes("nivel 2") || name.includes("nivel2")) {
      return "/Service/EstMusical/Est2.jpg";
    } else if (name.includes("n3") || name.includes("nivel 3") || name.includes("nivel3")) {
      return "/Service/EstMusical/Est3.jpg";
    }
    return "/Service/EstMusical/Est1.jpg";
  }
  if (name.includes("inglés") || name.includes("ingles") || name.includes("english")) {
    return "/Service/Servicio.jpg";
  }

  return "/Service/Servicio.jpg";
}
