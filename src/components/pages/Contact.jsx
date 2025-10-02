// src/components/pages/Contact.jsx
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { Button, Card, Label, TextInput, Textarea } from "flowbite-react";
import { PageLayout } from "../layout";
import translations from "../../translations";
import { Location, Phone, Email, Clock } from "../ui/Icons";

export default function Contact() {
  const { lang } = useAuth();
  const t = translations[lang].contact;

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
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Request failed");
      }

      alert(t.messageSent || "Mensaje enviado correctamente");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert(t.messageError || "Ocurrió un error al enviar tu mensaje.");
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
      </main>
    </PageLayout>
  );
}
