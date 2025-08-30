import { useAuth } from "../../contexts/AuthContext";
import { PageLayout } from '../layout'
import { TestimonialCard, RecitalCard } from '../ui'
import translations from '../../translations'

export default function About() {
  const { lang } = useAuth();
  const t = translations[lang].about;

  const testimonials = [
    {
      name: t.testimonial1Name,
      text: t.testimonial1Text,
      rating: 5,
      role: t.testimonial1Role,
    },
    {
      name: t.testimonial2Name,
      text: t.testimonial2Text,
      rating: 5,
      role: t.testimonial2Role,
    },
    {
      name: t.testimonial3Name,
      text: t.testimonial3Text,
      rating: 5,
      role: t.testimonial3Role,
    },
  ];

  const recitalEvents = [
    {
      date: t.recital1Date,
      title: t.recital1Title,
      description: t.recital1Description,
      participants: 25,
      image: "/RecitalDiciembre.jpg",
    },
    {
      date: t.recital2Date,
      title: t.recital2Title,
      description: t.recital2Description,
      participants: 12,
      image: "/RecitalInicio.jpg",
    },
    {
      date: t.recital3Date,
      title: t.recital3Title,
      description: t.recital3Description,
      participants: 18,
      image: "/RecitalSpring.jpg",
    },
  ];
  return (
    <PageLayout>
      <main className="min-h-screen flex-1">
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center bg-no-repeat h-[500px] flex items-center justify-center text-white"
          style={{ backgroundImage: "url('/Nosotros.jpg')" }}
        >
          <div className="bg-black/60 absolute inset-0"></div>
          <div className="relative z-10 text-center p-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              {t.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-8 bg-gray-50 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Mission */}
              <div className="bg-white p-8 rounded-lg text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/4 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-slate-800 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">
                    {t.mission.toUpperCase()}
                  </h3>
                </div>
                <div className="pb-24">
                  <p className="leading-relaxed text-gray-600 text-center">
                    {t.missionText}
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white p-8 rounded-lg text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/4 h-2 bg-purple-500"></div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-slate-800 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">
                    {t.vision.toUpperCase()}
                  </h3>
                </div>
                <div className="pb-24">
                  <p className="leading-relaxed text-gray-600 text-center">
                    {t.visionText}
                  </p>
                </div>
              </div>

              {/* Commitment */}
              <div className="bg-white p-8 rounded-lg text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/4 h-2 bg-pink-500"></div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-slate-800 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">
                    {t.commitment.toUpperCase()}
                  </h3>
                </div>
                <div className="pb-24">
                  <p className="leading-relaxed text-gray-600 text-center">
                    {t.commitmentText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Career Section */}
        <section className="py-16 px-8 bg-white w-full">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-slate-800 text-3xl lg:text-4xl font-bold mb-4">
                  {t.professionalCareer}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.careerText}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-slate-800">
                      20+
                    </span>
                    <span className="text-sm text-gray-600">
                      {t.yearsExperience}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-slate-800">
                      100+
                    </span>
                    <span className="text-sm text-gray-600">
                      {t.studentsTrained}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-slate-800">
                      30+
                    </span>
                    <span className="text-sm text-gray-600">
                      {t.recitalsOrganized}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-72">
                <div className="h-96 w-full">
                  <img
                    src="/teacher.jpg"
                    alt="Teacher Elizabeth Delgado"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recitals */}
        <section className="py-16 px-8 w-full">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-slate-800 text-3xl lg:text-4xl font-bold mb-4">{t.recitals}</h2>
            <p className="text-center max-w-2xl mx-auto mb-12 text-lg text-gray-600 leading-relaxed font-bold">{t.recitalsText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recitalEvents.map((event, index) => (
                <RecitalCard key={index} recital={event} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-8 bg-blue-50 w-full">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-slate-800 text-3xl lg:text-4xl font-bold mb-4">{t.testimonials}</h2>
            <p className="text-center max-w-2xl mx-auto mb-12 text-lg text-gray-600 leading-relaxed">{t.testimonialsText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
