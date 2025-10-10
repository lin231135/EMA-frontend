// src/components/pages/Service.jsx
import { Card } from "flowbite-react"; 
import { useAuth } from "../../contexts/AuthContext";
import { PageLayout } from "../layout";
import translations from "../../translations";

function ServiceBlock({
  title,
  description,
  bullets = [],
  img,
  reverse = false,
  ctaLabel = "Más info",
}) {
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
          {description && (
            <p className="text-gray-600 leading-relaxed">{description}</p>
          )}

          {bullets?.length > 0 && (
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Imagen */}
        <div className="w-full md:w-1/2">
          <img
            src={img}
            alt={title}
            className="w-full h-52 sm:h-64 md:h-56 lg:h-64 xl:h-72 object-cover rounded-xl"
            loading="lazy"
          />
        </div>
      </div>
    </Card>
  );
}

export default function Service() {
  const { lang } = useAuth();
  const t = translations?.[lang] || {};
  const tc = t.common || {};

  const pageTitle = tc.service || "Nosotros";
  const pageSubtitle =
    tc.serviceSubtitle ||
    "Conoce nuestros servicios, modalidades y acompáñanos en esta aventura musical.";

  // Estas rutas con "/" esperan archivos en /public
  const img1 = "/RecitalDiciembre.jpg";
  const img2 = "/fotoPiano.jpg";
  const img3 = "/canto.png";

  return (
    <PageLayout>
      {/* Hero con imagen de fondo */}
      <section className="relative w-full">
        <div className="relative h-[220px] sm:h-[260px] md:h-[320px] w-full overflow-hidden rounded-none">
          <img
            src="/fotoPiano2.jpg"
            alt="Hero Nosotros"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/40" />
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

      {/* Contenido */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Bloque 1: Estimulación Musical */}
          <ServiceBlock
            title={t.services?.stimulationTitle || "Estimulación Musical"}
            description={
              t.services?.stimulationDesc ||
              "Programas para niños y niñas donde la música se convierte en el puente para desarrollar habilidades cognitivas, motrices y socioemocionales."
            }
            bullets={[
              t.services?.stimulationB1 || "Sesiones lúdicas y participativas.",
              t.services?.stimulationB2 ||
                "Enfoque por etapas según edad y ritmo de aprendizaje.",
              t.services?.stimulationB3 ||
                "Guía de práctica para casa y seguimiento con padres.",
            ]}
            img={img1}
            reverse={false}
            ctaLabel={t.common?.moreInfo || "Más info"}
          />

          {/* Bloque 2: Piano */}
          <div className="mt-8 sm:mt-10">
            <ServiceBlock
              title={t.services?.pianoTitle || "Piano"}
              description={
                t.services?.pianoDesc ||
                "Clases personalizadas desde nivel básico hasta avanzado, con repertorio moderno y clásico para fortalecer técnica, lectura y musicalidad."
              }
              bullets={[
                t.services?.pianoB1 ||
                  "Plan de estudio individual y metas por módulo.",
                t.services?.pianoB2 ||
                  "Preparación para recitales y evaluaciones internas.",
                t.services?.pianoB3 || "Opciones presenciales y en línea.",
              ]}
              img={img2}
              reverse={true}
              ctaLabel={t.common?.moreInfo || "Más info"}
            />
          </div>

          {/* Bloque 3: Canto */}
          <div className="mt-8 sm:mt-10">
            <ServiceBlock
              title={t.services?.singTitle || "Canto"}
              description={
                t.services?.singDesc ||
                "Entrena tu voz con enfoque saludable: respiración, colocación, afinación y proyección. Trabajamos tu estilo para que te sientas cómodo en el escenario."
              }
              bullets={[
                t.services?.singB1 || "Ejercicios técnicos y de expresión.",
                t.services?.singB2 || "Repertorio guiado según tus objetivos.",
                t.services?.singB3 ||
                  "Grabaciones periódicas para medir tu progreso.",
              ]}
              img={img3}
              reverse={false}
              ctaLabel={t.common?.moreInfo || "Más info"}
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
