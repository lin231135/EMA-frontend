import { useState } from "react";
import { Navbar, NavbarDivider, NavbarItem, NavbarSection, Logo, AvatarDropdown, Footer } from '../layout'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { translations } from '../../translations'

export default function Profile() {
  const [lang, setLang] = useState("es");
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang];

  // Estados para edición del perfil
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    instrument: user?.instrument || '',
    level: user?.level || ''
  });

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Aquí irían las llamadas al backend para actualizar el perfil
      console.log('Guardando perfil:', formData);
      
      // Simular guardado exitoso
      alert(lang === "es" ? "Perfil actualizado correctamente" : "Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert(lang === "es" ? "Error al actualizar el perfil" : "Error updating profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      instrument: user?.instrument || '',
      level: user?.level || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar>
        <a href="#" className="flex items-center">
          <Logo />
        </a>
        <NavbarDivider />
        <NavbarSection>
          <NavbarItem href="/">{lang === "es" ? "Inicio" : "Home"}</NavbarItem>
          <NavbarItem href="/about">{lang === "es" ? "Nosotros" : "About"}</NavbarItem>
          <NavbarItem href="#content">{lang === "es" ? "Contenido" : "Services"}</NavbarItem>
          <NavbarItem href="#contact">{lang === "es" ? "Contacto" : "Contact"}</NavbarItem>
        </NavbarSection>
        <NavbarSection>
          <button 
            onClick={() => setLang(lang === "es" ? "en" : "es")} 
            className="text-gray-200 hover:text-white px-2 py-2 sm:px-3 sm:py-2 rounded-md text-sm sm:text-base font-medium mr-2 sm:mr-4 transition-colors duration-200"
          >
            {t.langToggle}
          </button>
          <AvatarDropdown
            isAuthenticated={isAuthenticated}
            user={user}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            translations={t}
          />
        </NavbarSection>
      </Navbar>

      <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#011C33] mb-2">
            {lang === "es" ? "Mi Perfil" : "My Profile"}
          </h1>
          <p className="text-gray-600 text-lg">
            {lang === "es" ? "Gestiona tu información personal" : "Manage your personal information"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex-shrink-0">
              <img 
                src={user?.avatar || "/teacher.jpg"} 
                alt={user?.name || "User"} 
                className="w-20 h-20 rounded-full object-cover border-3 border-[#01A6CC]"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-[#011C33] mb-1">
                {user?.name || formData.name}
              </h2>
              <p className="text-[#01A6CC] font-medium">
                {lang === "es" ? "Estudiante" : "Student"}
              </p>
              <p className="text-gray-500 text-sm">
                {lang === "es" ? "Miembro desde" : "Member since"}: {user?.joinDate || "Enero 2024"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-xl font-semibold text-[#011C33] mb-4 sm:mb-0">
                {lang === "es" ? "Información Personal" : "Personal Information"}
              </h3>
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isEditing 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-[#01A6CC] hover:bg-[#0186a3] text-white'
                  }`}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                  {isEditing 
                    ? (lang === "es" ? "Guardar" : "Save")
                    : (lang === "es" ? "Editar" : "Edit")
                  }
                </button>
                {isEditing && (
                  <button 
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors" 
                    onClick={handleCancel}
                  >
                    {lang === "es" ? "Cancelar" : "Cancel"}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "es" ? "Nombre completo" : "Full name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                    isEditing 
                      ? 'border-[#01A6CC] bg-white focus:ring-2 focus:ring-[#01A6CC]/20 focus:border-[#01A6CC]' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "es" ? "Correo electrónico" : "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                    isEditing 
                      ? 'border-[#01A6CC] bg-white focus:ring-2 focus:ring-[#01A6CC]/20 focus:border-[#01A6CC]' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "es" ? "Teléfono" : "Phone"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={lang === "es" ? "Opcional" : "Optional"}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                    isEditing 
                      ? 'border-[#01A6CC] bg-white focus:ring-2 focus:ring-[#01A6CC]/20 focus:border-[#01A6CC]' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "es" ? "Fecha de nacimiento" : "Birth date"}
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                    isEditing 
                      ? 'border-[#01A6CC] bg-white focus:ring-2 focus:ring-[#01A6CC]/20 focus:border-[#01A6CC]' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "es" ? "Instrumento principal" : "Main instrument"}
                </label>
                <select
                  name="instrument"
                  value={formData.instrument}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                    isEditing 
                      ? 'border-[#01A6CC] bg-white focus:ring-2 focus:ring-[#01A6CC]/20 focus:border-[#01A6CC]' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <option value="">{lang === "es" ? "Seleccionar..." : "Select..."}</option>
                  <option value="piano">{lang === "es" ? "Piano" : "Piano"}</option>
                  <option value="violin">{lang === "es" ? "Violín" : "Violin"}</option>
                  <option value="guitar">{lang === "es" ? "Guitarra" : "Guitar"}</option>
                  <option value="flute">{lang === "es" ? "Flauta" : "Flute"}</option>
                  <option value="voice">{lang === "es" ? "Canto" : "Voice"}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "es" ? "Nivel" : "Level"}
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                    isEditing 
                      ? 'border-[#01A6CC] bg-white focus:ring-2 focus:ring-[#01A6CC]/20 focus:border-[#01A6CC]' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <option value="">{lang === "es" ? "Seleccionar..." : "Select..."}</option>
                  <option value="beginner">{lang === "es" ? "Principiante" : "Beginner"}</option>
                  <option value="intermediate">{lang === "es" ? "Intermedio" : "Intermediate"}</option>
                  <option value="advanced">{lang === "es" ? "Avanzado" : "Advanced"}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-[#011C33] mb-6">
              {lang === "es" ? "Estadísticas" : "Statistics"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                <div className="text-3xl font-bold text-[#01A6CC] mb-2">12</div>
                <div className="text-gray-600 text-sm font-medium">
                  {lang === "es" ? "Lecciones completadas" : "Lessons completed"}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                <div className="text-3xl font-bold text-[#01A6CC] mb-2">3</div>
                <div className="text-gray-600 text-sm font-medium">
                  {lang === "es" ? "Recitales participados" : "Recitals participated"}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                <div className="text-3xl font-bold text-[#01A6CC] mb-2">6</div>
                <div className="text-gray-600 text-sm font-medium">
                  {lang === "es" ? "Meses como estudiante" : "Months as student"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
