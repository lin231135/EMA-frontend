import { useState } from "react";
import { PageLayout } from "../layout";
import { translations } from "../../translations";
import HeroCarousel from "../ui/HeroCarousel"; // ⬅️ nuevo

export default function Home() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  return (
    <PageLayout lang={lang} setLang={setLang} t={t}>
      {/* === Hero Carousel (EMA-29) === */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="max-w-7xl mx-auto">
          <HeroCarousel
            slides={t.homeCarousel.slides}
            prevLabel={t.homeCarousel.prev}
            nextLabel={t.homeCarousel.next}
            ctaPrimary={t.homeCarousel.ctaPrimary}
            ctaSecondary={t.homeCarousel.ctaSecondary}
            onPrimary={() => console.log("Go to Courses")}
            onSecondary={() => console.log("Go to Exams")}
          />
        </div>
      </section>

      {/* === Features (se deja igual) === */}
      <section className="py-16 px-8 text-center flex-1 bg-white w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-900">
            {t.features}:
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-12 max-w-4xl mx-auto">
            <div className="max-w-sm">
              <h4 className="text-xl font-semibold mb-4 text-teal-700">
                {t.packageA}
              </h4>
              <p className="text-gray-600 leading-relaxed">{t.lorem}</p>
            </div>
            <div className="max-w-sm">
              <h4 className="text-xl font-semibold mb-4 text-teal-700">
                {t.packageB}
              </h4>
              <p className="text-gray-600 leading-relaxed">{t.lorem}</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}