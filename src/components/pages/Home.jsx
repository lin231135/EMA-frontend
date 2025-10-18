import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../layout";
import translations from "../../translations";
import HeroCarousel from "../ui/HeroCarousel";
import { Button, Alert } from "flowbite-react";

// librerías para el mapa
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// librerias para sonidos (notas musicales)
import * as Tone from "tone";

// Ícono personalizado para el marcador
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function Home() {
  const { lang } = useAuth();
  const t = translations[lang].home;
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  //sonidos
  const synthRef = useRef(null);
  const samplerReadyRef = useRef(false);

  const API_BASE = String(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

  // envio de correo
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setAlert(null); // limpia alertas previas

    try {
      const response = await fetch(`${API_BASE}/join-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlert({
          type: "success",
          message: " Nos pondremos en contacto contigo pronto.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setAlert({
          type: "error",
          message: " Intente más tarde.",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Error de conexión con el servidor. Intente más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  //efecto notas musicales
  useEffect(() => {
    const onUserGesture = async () => {
      try {
        await Tone.start();

        // Ambience para sonido más realista
        const reverb = new Tone.Reverb({ decay: 2.8, wet: 0.25 }).toDestination();
        const comp = new Tone.Compressor({ threshold: -24, ratio: 3 }).connect(reverb);

        const sampler = new Tone.Sampler({
          // Más zonas para mejor timbre
          urls: {
            A1: "A1.mp3",
            C2: "C2.mp3",
            "D#2": "Ds2.mp3",
            "F#2": "Fs2.mp3",
            A2: "A2.mp3",
            C3: "C3.mp3",
            "D#3": "Ds3.mp3",
            "F#3": "Fs3.mp3",
            A3: "A3.mp3",
            C4: "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",
            A4: "A4.mp3",
            C5: "C5.mp3",
            "D#5": "Ds5.mp3",
            "F#5": "Fs5.mp3",
            A5: "A5.mp3",
          },
          baseUrl: "https://tonejs.github.io/audio/salamander/",
          attack: 0.003,
          release: 1.2,
        });

        sampler.volume.value = -6; // menos duro
        sampler.connect(comp);

        await sampler.loaded; // espera carga
        synthRef.current = sampler;
        samplerReadyRef.current = true;
      } catch (e) {
        console.error(e);
      }
      window.removeEventListener("pointerdown", onUserGesture);
    };

    window.addEventListener("pointerdown", onUserGesture, { once: true });
    return () => window.removeEventListener("pointerdown", onUserGesture);
  }, []);

  const playCourseNote = (i) => {
    if (!samplerReadyRef.current || !synthRef.current) return;
    const notes = ["C5", "D5", "E5", "F5"]; 
    synthRef.current.triggerAttackRelease(notes[i % notes.length], "8n", undefined, 0.9);
  };

  return (
    <PageLayout>
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
              src="Service/Piano/fotoPiano2.jpg"
              alt="Children learning music"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>

          {/* Text second */}
          <div className="md:w-1/2 text-left">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-900">
              {t.philosophyTitle}
            </h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl mb-8">
              {t.philosophyText}
            </p>
            <button className="bg-[#01A6CC] hover:bg-[#018bb0] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              {t.reserveButton}
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
              {t.enrollTitle}
            </h2>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              {t.enrollSubtitle}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {t.enrollText}
            </p>
            <button className="bg-cyan-500 hover:bg-[#018bb0] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              onClick={() => navigate("/service")}
            >
              {t.viewCoursesButton}
            </button>
          </div>

          {/* Imagen */}
          <div className="md:w-1/2">
            <img
              src="Service/Piano/fotoPiano.jpg"
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
              { title: "Singing Class", image: "Service/Canto/canto.png" },
              { title: "Piano", image: "Service/Piano/fotoPiano5.jpg" },
              { title: "Music Stimulation 2-3 years old", image: "Service/EstMusical/Est1.jpg" },
              { title: "Music Stimulation 4-5 years old", image: "Service/EstMusical/Est2.jpg" },
            ].map((course, index) => (
              <div
                key={index}
                onMouseEnter={() => playCourseNote(index)}
                className="group h-80 flex flex-col rounded-xl bg-white border border-gray-100 shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-cyan-200"
              >
                {/* Imagen = 80% de alto */}
                <div className="flex-[4] overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Título = 20% de alto */}
                <div className="flex-[1] p-4 flex items-center justify-center bg-white">
                  <h4 className="font-semibold text-gray-900 text-center">{course.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Join Our Team
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            This form is for professional teachers who would like to be part of our academy.
            Please fill out your information and we will contact you soon.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Mapa */}
            <div className="w-full h-full min-h-[500px]">
              <MapContainer
                center={[14.594403587646779, -90.49196870798745]}
                zoom={17}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[14.594116, -90.489854]} icon={markerIcon}>
                  <Popup>
                    19 Avenida A 4-35, Ciudad de Guatemala <br />
                    <a
                      href="https://www.google.com/maps?q=19+Avenida+A+4-39,+Ciudad+de+Guatemala"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver en Google Maps
                    </a>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Formulario */}
            <div className="p-8 flex flex-col items-center justify-center w-full">
              {/* Alertas dinámicas */}
              {alert && (
                <Alert
                  color={alert.type === "success" ? "success" : "failure"}
                  onDismiss={() => setAlert(null)}
                  className="mb-4 w-full"
                >
                  <span className="font-medium">
                    {alert.type === "success" ? "Formulario enviado con éxito." : "Error al enviar el formulario."}
                  </span>
                  {alert.message}
                </Alert>
              )}

              <form className="w-full space-y-6" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-md border border-gray-400 bg-gray-100 text-gray-900 placeholder:text-gray-700 dark:placeholder:text-gray-400 placeholder:opacity-100 outline-none focus:ring-2 focus:ring-[#01A6CC]"
                  />
                  {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-md border border-gray-400 bg-gray-100 text-gray-900 placeholder:text-gray-700 dark:placeholder:text-gray-400 placeholder:opacity-100 outline-none focus:ring-2 focus:ring-[#01A6CC]"
                  />
                  {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter the subject"
                    className="w-full px-4 py-3 rounded-md border border-gray-400 bg-gray-100 text-gray-900 placeholder:text-gray-700 dark:placeholder:text-gray-400 placeholder:opacity-100 outline-none focus:ring-2 focus:ring-[#01A6CC]"
                  />
                </div>

                <div>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us a bit about your teaching experience..."
                    className="w-full px-4 py-3 rounded-md border border-gray-400 bg-gray-100 text-gray-900 placeholder:text-gray-700 dark:placeholder:text-gray-400 placeholder:opacity-100 outline-none focus:ring-2 focus:ring-[#01A6CC]"
                  ></textarea>
                  {errors?.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  style={{ backgroundColor: "#01A6CC" }}
                  className="w-1/3 ml-auto block text-white font-semibold py-3 rounded-lg hover:bg-[#018bb0] transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Application"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
