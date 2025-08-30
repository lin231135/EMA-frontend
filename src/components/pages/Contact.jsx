import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { Button, Card, Label, TextInput, Textarea } from "flowbite-react";
import { PageLayout } from '../layout'
import translations from '../../translations'

export default function Contact() {
  const { lang } = useAuth();
  const t = translations[lang].contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    // Aquí se puede agregar la lógica para enviar el formulario
    alert(t.messageSent || 'Mensaje enviado correctamente');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
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
                <h2 className="text-2xl font-bold mb-6 text-teal-500">
                  {t.sendMessage}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" value={t.name} className="text-gray-200" />
                    <TextInput
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t.namePlaceholder}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-200"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" value={t.email} className="text-gray-200" />
                    <TextInput
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-200"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" value={t.phone} className="text-gray-200" />
                    <TextInput
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-200"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" value={t.subject} className="text-gray-200" />
                    <TextInput
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder={t.subjectPlaceholder}
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-200"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" value={t.message} className="text-gray-200" />
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={t.messagePlaceholder}
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-200 resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white border-teal-700"
                  >
                    {t.sendButton}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-8 bg-white border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-teal-500">
                  {t.contactInfo}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-teal-600 text-lg">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">
                        {t.address}
                      </h3>
                      <p className="text-gray-200">
                        {t.addressDetails}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-teal-600 text-lg">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">
                        {t.phoneContact}
                      </h3>
                      <p className="text-gray-200">+502 1234-5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-teal-600 text-lg">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">
                        {t.emailContact}
                      </h3>
                      <p className="text-gray-200">info@emamusic.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-teal-600 text-lg">🕒</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">
                        {t.schedule}
                      </h3>
                      <p className="text-gray-200">
                        {t.scheduleDetails}
                      </p>
                      <p className="text-gray-200">
                        {t.scheduleWeekend}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Info Card */}
              <Card className="p-8 bg-teal-50 border-teal-200 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-teal-500">
                  {t.quickInfo}
                </h3>
                <ul className="space-y-2 text-gray-200">
                  <li>• {t.quickInfo1}</li>
                  <li>• {t.quickInfo2}</li>
                  <li>• {t.quickInfo3}</li>
                  <li>• {t.quickInfo4}</li>
                  <li>• {t.quickInfo5}</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
