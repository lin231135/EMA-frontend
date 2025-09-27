import { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import translations from '../../translations'
import { PageLayout } from "../layout";

export default function Profile() {
  const { isAuthenticated, user, logout, loading, lang } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang].common;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        <div className="text-lg text-gray-600">{t.loading}</div>
      </div>
    );
  }

  // Si no está autenticado y no está haciendo logout, no renderizar nada
  if (!isAuthenticated && !isLoggingOut) {
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
      alert(t.profileUpdated);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert(t.profileUpdateError);
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
    <PageLayout>
      <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#011C33] mb-2">
            {t.profileTitle}
          </h1>
          <p className="text-gray-600 text-lg">
            {t.profileSubtitle}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex-shrink-0">
              <img 
                src={user?.avatar || "https://i.pravatar.cc/150?img=3"} 
                alt={user?.name || "User"} 
                className="w-20 h-20 rounded-full object-cover border-3 border-[#01A6CC]"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-[#011C33] mb-1">
                {user?.name || formData.name}
              </h2>
              <p className="text-[#01A6CC] font-medium">
                {t.student}
              </p>
              <p className="text-gray-500 text-sm">
                {t.memberSince}: {user?.joinDate || "Enero 2024"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-xl font-semibold text-[#011C33] mb-4 sm:mb-0">
                {t.personalInfo}
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
                    ? t.save
                    : t.editProfile
                  }
                </button>
                {isEditing && (
                  <button 
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors" 
                    onClick={handleCancel}
                  >
                    {t.cancel}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.fullName}
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
                  {t.email}
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
                  {t.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={t.optional}
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                    isEditing 
                      ? 'border-[#01A6CC] bg-white focus:ring-2 focus:ring-[#01A6CC]/20 focus:border-[#01A6CC]' 
                      : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.dob}
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
                  {t.mainInstrument}
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
                  <option value="">{t.select}</option>
                  <option value="piano">{t.piano}</option>
                  <option value="voice">{t.voice}</option>
                  <option value="musical_stimulation_2_3">Estimulación Musical (2-3 años)</option>
                  <option value="musical_stimulation_4_5">Estimulación Musical (4-5 años)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.level}
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
                  <option value="">{t.select}</option>
                  <option value="beginner">{t.beginner}</option>
                  <option value="intermediate">{t.intermediate}</option>
                  <option value="advanced">{t.advanced}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-[#011C33] mb-6">
              {t.statistics}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                <div className="text-3xl font-bold text-[#01A6CC] mb-2">12</div>
                <div className="text-gray-600 text-sm font-medium">
                  {t.lessonsCompleted}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                <div className="text-3xl font-bold text-[#01A6CC] mb-2">3</div>
                <div className="text-gray-600 text-sm font-medium">
                  {t.recitalsParticipated}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                <div className="text-3xl font-bold text-[#01A6CC] mb-2">6</div>
                <div className="text-gray-600 text-sm font-medium">
                  {t.monthsAsStudent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
