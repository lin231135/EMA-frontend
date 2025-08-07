import { useState, useEffect } from "react";
import { Navbar, NavbarDivider, NavbarItem, NavbarSection, Logo, AvatarDropdown, Footer } from '../layout'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { translations } from '../../translations'

export default function Settings() {
  const [lang, setLang] = useState("es");
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang];
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Estados para las configuraciones
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      recitalReminders: true,
      lessonReminders: true,
      newsUpdates: false
    },
    privacy: {
      profileVisible: true,
      showProgress: false,
      allowMessages: true
    },
    preferences: {
      language: lang,
      theme: 'light',
      autoSave: true,
      timezone: 'America/Guatemala'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    navigate('/');
  };

  // Verificar autenticación en useEffect para evitar conflicto con logout
  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoggingOut) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate, isLoggingOut]);

  // Mostrar loading solo si realmente está cargando y no hay usuario
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado y no está haciendo logout, no renderizar nada
  if (!isAuthenticated && !isLoggingOut) {
    return null;
  }

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePrivacyChange = (key) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));

    // Cambiar idioma inmediatamente si se selecciona
    if (key === 'language') {
      setLang(value);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(lang === "es" ? "Las contraseñas no coinciden" : "Passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert(lang === "es" ? "La contraseña debe tener al menos 6 caracteres" : "Password must be at least 6 characters");
      return;
    }

    try {
      // Aquí iría la llamada al backend para cambiar la contraseña
      console.log('Cambiando contraseña...');
      alert(lang === "es" ? "Contraseña actualizada correctamente" : "Password updated successfully");
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      alert(lang === "es" ? "Error al cambiar la contraseña" : "Error changing password");
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Aquí irían las llamadas al backend para guardar configuraciones
      console.log('Guardando configuraciones:', settings);
      alert(lang === "es" ? "Configuraciones guardadas correctamente" : "Settings saved successfully");
    } catch (error) {
      console.error('Error al guardar configuraciones:', error);
      alert(lang === "es" ? "Error al guardar configuraciones" : "Error saving settings");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmMessage = lang === "es" 
      ? "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
      : "Are you sure you want to delete your account? This action cannot be undone.";
    
    if (window.confirm(confirmMessage)) {
      try {
        // Aquí iría la llamada al backend para eliminar la cuenta
        console.log('Eliminando cuenta...');
        alert(lang === "es" ? "Cuenta eliminada" : "Account deleted");
        logout();
        navigate('/');
      } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        alert(lang === "es" ? "Error al eliminar la cuenta" : "Error deleting account");
      }
    }
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
            {lang === "es" ? "Configuraciones" : "Settings"}
          </h1>
          <p className="text-gray-600 text-lg">
            {lang === "es" ? "Personaliza tu experiencia en la plataforma" : "Customize your platform experience"}
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Notificaciones */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#011C33] mb-4 pb-2 border-b-2 border-[#01A6CC]">
              {lang === "es" ? "Notificaciones" : "Notifications"}
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="w-5 h-5 text-[#01A6CC] bg-gray-100 border-gray-300 rounded focus:ring-[#01A6CC] focus:ring-2"
                />
                <span className="font-medium text-gray-700">
                  {lang === "es" ? "Notificaciones por email" : "Email notifications"}
                </span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                  className="w-5 h-5 text-[#01A6CC] bg-gray-100 border-gray-300 rounded focus:ring-[#01A6CC] focus:ring-2"
                />
                <span className="font-medium text-gray-700">
                  {lang === "es" ? "Notificaciones por SMS" : "SMS notifications"}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.recitalReminders}
                  onChange={() => handleNotificationChange('recitalReminders')}
                  className="w-5 h-5 text-[#01A6CC] bg-gray-100 border-gray-300 rounded focus:ring-[#01A6CC] focus:ring-2"
                />
                <span className="font-medium text-gray-700">
                  {lang === "es" ? "Recordatorios de recitales" : "Recital reminders"}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.lessonReminders}
                  onChange={() => handleNotificationChange('lessonReminders')}
                  className="w-5 h-5 text-[#01A6CC] bg-gray-100 border-gray-300 rounded focus:ring-[#01A6CC] focus:ring-2"
                />
                <span className="font-medium text-gray-700">
                  {lang === "es" ? "Recordatorios de lecciones" : "Lesson reminders"}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.newsUpdates}
                  onChange={() => handleNotificationChange('newsUpdates')}
                  className="w-5 h-5 text-[#01A6CC] bg-gray-100 border-gray-300 rounded focus:ring-[#01A6CC] focus:ring-2"
                />
                <span className="font-medium text-gray-700">
                  {lang === "es" ? "Actualizaciones y noticias" : "News and updates"}
                </span>
              </label>
            </div>
          </div>

          {/* Privacidad */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#011C33] mb-4 pb-2 border-b-2 border-[#01A6CC]">
              {lang === "es" ? "Privacidad" : "Privacy"}
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.profileVisible}
                  onChange={() => handlePrivacyChange('profileVisible')}
                  className="w-5 h-5 text-[#01A6CC] bg-gray-100 border-gray-300 rounded focus:ring-[#01A6CC] focus:ring-2"
                />
                <span className="font-medium text-gray-700">
                  {lang === "es" ? "Perfil visible para otros estudiantes" : "Profile visible to other students"}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showProgress}
                  onChange={() => handlePrivacyChange('showProgress')}
                  className="w-5 h-5 text-[#01A6CC] bg-gray-100 border-gray-300 rounded focus:ring-[#01A6CC] focus:ring-2"
                />
                <span className="font-medium text-gray-700">
                  {lang === "es" ? "Mostrar progreso público" : "Show public progress"}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.allowMessages}
                  onChange={() => handlePrivacyChange('allowMessages')}
                  className="w-5 h-5 text-[#01A6CC] bg-gray-100 border-gray-300 rounded focus:ring-[#01A6CC] focus:ring-2"
                />
                <span className="font-medium text-gray-700">
                  {lang === "es" ? "Permitir mensajes de otros estudiantes" : "Allow messages from other students"}
                </span>
              </label>
            </div>
          </div>

          {/* Preferencias */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#011C33] mb-4 pb-2 border-b-2 border-[#01A6CC]">
              {lang === "es" ? "Preferencias" : "Preferences"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "es" ? "Idioma" : "Language"}
                </label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A6CC] focus:border-[#01A6CC] bg-white"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === "es" ? "Tema" : "Theme"}
                </label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A6CC] focus:border-[#01A6CC] bg-white"
                >
                  <option value="light">{lang === "es" ? "Claro" : "Light"}</option>
                  <option value="dark">{lang === "es" ? "Oscuro" : "Dark"}</option>
                  <option value="auto">{lang === "es" ? "Automático" : "Auto"}</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.preferences.autoSave}
                  onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                  className="w-5 h-5 text-[#01A6CC] bg-gray-100 border-gray-300 rounded focus:ring-[#01A6CC] focus:ring-2"
                />
                <span className="font-medium text-gray-700">
                  {lang === "es" ? "Guardar automáticamente" : "Auto-save"}
                </span>
              </label>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#011C33] mb-4 pb-2 border-b-2 border-[#01A6CC]">
              {lang === "es" ? "Seguridad" : "Security"}
            </h3>
            <div className="space-y-4">
              <button 
                className="bg-[#01A6CC] hover:bg-[#0186a3] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
              >
                {lang === "es" ? "Cambiar contraseña" : "Change password"}
              </button>

              {showPasswordSection && (
                <form onSubmit={handlePasswordSubmit} className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === "es" ? "Contraseña actual" : "Current password"}
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A6CC] focus:border-[#01A6CC]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === "es" ? "Nueva contraseña" : "New password"}
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A6CC] focus:border-[#01A6CC]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === "es" ? "Confirmar nueva contraseña" : "Confirm new password"}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01A6CC] focus:border-[#01A6CC]"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        {lang === "es" ? "Actualizar contraseña" : "Update password"}
                      </button>
                      <button 
                        type="button" 
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        onClick={() => setShowPasswordSection(false)}
                      >
                        {lang === "es" ? "Cancelar" : "Cancel"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Acciones principales */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button 
              className="w-full bg-[#01A6CC] hover:bg-[#0186a3] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors mb-6"
              onClick={handleSaveSettings}
            >
              {lang === "es" ? "Guardar configuraciones" : "Save settings"}
            </button>
            
            <div className="pt-6 border-t border-red-100">
              <h4 className="text-red-600 text-lg font-semibold mb-4">
                {lang === "es" ? "Zona peligrosa" : "Danger Zone"}
              </h4>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={handleDeleteAccount}
              >
                {lang === "es" ? "Eliminar cuenta" : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
