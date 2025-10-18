// src/components/pages/Contact.jsx
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { Button, Card, Label, TextInput, Textarea, Alert } from "flowbite-react";
import { PageLayout } from "../layout";
import translations from "../../translations";
import { Location, Phone, Email, Clock } from "../ui/Icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícono personalizado para el marcador
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});


export default function Contact() {
  const { lang } = useAuth();
  const t = translations[lang].contact;
  const [alert, setAlert] = useState(null);

  // Normaliza la base del API y evita doble slash al concatenar
  const API_BASE = String(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null); // Limpiar alertas previas

    // Enviar valores “limpios” (sin espacios a los lados)
    const payload = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [
        k,
        typeof v === "string" ? v.trim() : v,
      ])
    );

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Si el backend responde 202 { ok: true }, res.ok será true
      if (res.ok) {
        setAlert({
          type: "success",
          message: " Nos pondremos en contacto contigo.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setAlert({
          type: "error",
          message: "Intente más tarde.",
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

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t.contactTitle}
          </h1>
          <p className="text-xl lg:text-2xl text-teal-100">
            {t.contactSubtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <main className="flex-1 py-16 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="p-8 bg-white border-gray-200 shadow-lg">
                {/* Alertas dinámicas */}
                {alert && (
                  <Alert
                    color={alert.type === "success" ? "success" : "failure"}
                    onDismiss={() => setAlert(null)}
                    className="mb-4 w-full"
                  >
                    <span className="font-medium">
                      {alert.type === "success" ? "Mensaje enviado con éxito." : "Ocurrió un error al enviar tu mensaje."}
                    </span>
                    {alert.message}
                  </Alert>
                )}
                <h2 className="text-2xl font-bold mb-6 text-cyan-600">
                  {t.sendMessage}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" value={t.name} />
                    <TextInput
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t.namePlaceholder}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" value={t.email} />
                    <TextInput
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" value={t.phone} />
                    <TextInput
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" value={t.subject} />
                    <TextInput
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder={t.subjectPlaceholder}
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" value={t.message} />
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={t.messagePlaceholder}
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-700 disabled:opacity-60"
                  >
                    {loading ? t.sending || "Enviando..." : t.sendButton}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-8 bg-white border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-cyan-600">
                  {t.contactInfo}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-4">
                      <Location className="text-cyan-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-600">
                        {t.address}
                      </h3>
                      <p className="text-gray-500">{t.addressDetails}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-4">
                      <Phone className="text-cyan-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-600">
                        {t.phoneContact}
                      </h3>
                      <p className="text-gray-500">+502 5126-9532</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-4">
                      <Email className="text-cyan-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-600">
                        {t.emailContact}
                      </h3>
                      <p className="text-gray-500">
                        elidelgado@elliesmusicacademy.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-4">
                      <Clock className="text-cyan-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-600">
                        {t.schedule}
                      </h3>
                      <p className="text-gray-500">{t.scheduleDetails}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Info Card */}
              <Card className="p-8 bg-cyan-50 border-cyan-200 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-cyan-600">
                  {t.quickInfo}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• {t.quickInfo1}</li>
                  <li>• {t.quickInfo2}</li>
                  <li>• {t.quickInfo3}</li>
                  <li>• {t.quickInfo4}</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>

        {/* Dirección Interactiva */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Card className="p-8 bg-white border-gray-200 shadow-lg">
              <h2 className="text-3xl font-bold text-cyan-600 text-center mb-8">
                {t.locationTitle || "Our Location"}
              </h2>
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                <MapContainer
                  center={[14.594403587646779, -90.49196870798745]} // coordenadas corregidas
                  zoom={17}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker
                    position={[14.594116, -90.489854]}
                    icon={markerIcon}
                  >
                    <Popup>
                      19 Avenida A 4-35, Ciudad de Guatemala <br />
                      <a
                        href="https://www.google.com/maps?q=19+Avenida+A+4-39,+Ciudad+de+Guatemala"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 underline font-semibold"
                      >
                        Ver en Google Maps
                      </a>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card>
          </div>
        </section>


      </main>
    </PageLayout>
  );
}
