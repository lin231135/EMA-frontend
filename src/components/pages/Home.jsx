import { useState } from "react";
import { PageLayout } from "../layout";
import { translations } from "../../translations";
import HeroCarousel from "../ui/HeroCarousel";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícono personalizado para el marcador
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function Home() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  return (
    <PageLayout lang={lang} setLang={setLang} t={t}>
      {/* Hero Carousel */}
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

      <section className="py-16 px-8 flex-1 bg-white w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Image first */}
          <div className="md:w-1/2">
            <img
              src="fotoPiano2.jpg"
              alt="Children learning music"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>

          {/* Text second */}
          <div className="md:w-1/2 text-left">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-900">
              Our Philosophy:
            </h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl mb-8">
              At our music academy, we believe that music is the best way to
              stimulate creativity, discipline, and confidence in children.
              We provide a safe and fun environment to learn, with highly qualified
              teachers and teaching methods adapted to every age.
            </p>
            <button className="bg-[#01A6CC] hover:bg-[#018bb0] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Reserv your spot
            </button>
          </div>
        </div>
      </section>


      {/* Enroll Section con imagen */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Texto */}
          <div className="md:w-1/2 text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sign up for a course today
            </h2>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Boost your child's creativity and musical talent
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We offer courses for all ages, from music stimulation for the little ones
              to singing and piano classes for children and teenagers. Our personalized approach
              ensures that each student learns at their own pace, enjoying music while developing
              essential skills.
            </p>
            <button className="bg-[#01A6CC] hover:bg-[#018bb0] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              View Courses
            </button>
          </div>

          {/* Imagen */}
          <div className="md:w-1/2">
            <img
              src="fotoPiano.jpg"
              alt="Niños aprendiendo música"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Cursos */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Designed for children and adults who want to learn music in a fun and effective way.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Singing Class", image: "canto.png" },
              { title: "Piano", image: "piano.png" },
              { title: "Music Stimulation 2-3 years old", image: "est1.png" },
              { title: "Music Stimulation 4-5 years old", image: "est2.png" },
            ].map((course, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-w-16 aspect-h-9 mb-3">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg group-hover:shadow-lg transition-shadow"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 text-center">{course.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dirección Interactiva */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our location</h2>
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={[14.6173, -90.5222]} // Coordenadas aproximadas de Vista Hermosa 1, Zona 15
              zoom={16}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[14.6173, -90.5222]} icon={markerIcon}>
                <Popup>
                  19 avenida A 4-39, Vista Hermosa 1, Zona 15
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}