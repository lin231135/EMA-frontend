// src/components/forms/LoginForm.jsx
// Componente de formulario de inicio de sesión con modal de bienvenida

import React, { useState } from "react";
import PasswordModal from "./Popup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PageLayout from "../layout/PageLayout";
import { RegisterImageCard } from "../forms/RegisterCards";
import translations from "../../translations";
import WelcomeModal from "../ui/WelcomeModal";

/**
 * Componente Login
 * Formulario de inicio de sesión con validación, manejo de errores,
 * popup de restablecimiento de contraseña y modal de bienvenida.
 */
const Login = () => {
  // Hooks de contexto y navegación
  const { lang, login } = useAuth();
  const t = translations[lang].login;
  const navigate = useNavigate();

  // Estados del formulario
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Estados para el popup de restablecimiento
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Estado para el modal de bienvenida
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const [redirectTo, setRedirectTo] = useState("/");

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Redirección según el rol del usuario
  const computeRedirectByRole = (user) => {
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "padre":
        return "/parent/ParentProfileSelect";
      case "estudiante":
        return `/student/dashboard/${user.id}`;
      case "maestro":
        return `/teacher/dashboard/`;
      default:
        return "/";
    }
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError(t.errorAllFields);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      setError(t.errorInvalidEmail);
      return;
    }

    try {
      const { ok, data, error } = await login(
        credentials.email,
        credentials.password,
        rememberMe
      );

      if (!ok) throw new Error(error || t.errorLogin);

      const user = data.user;
      const isFirst = user.is_first_login || false;

      if (isFirst) {
        setIsFirstLogin(true);
        setShowResetPopup(true);
        return;
      }

      // Mostrar modal de bienvenida
      setWelcomeName(user.name || "");
      setRedirectTo(computeRedirectByRole(user));
      setShowWelcome(true);

      setError("");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(err.message);
    }
  };

  // Confirmar modal de bienvenida
  const handleWelcomeConfirm = () => {
    setShowWelcome(false);
    navigate(redirectTo);
  };

  // Actualizar contraseña del usuario
  const handlePasswordUpdate = async (data) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user")
      );

      const response = await fetch(
        "http://localhost:5000/api/auth/update-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            currentPassword: data.current,
            newPassword: data.new,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      alert(t.passwordUpdateSuccess);
      setTimeout(() => navigate("/"), 1000);
      setShowResetPopup(false);
      setIsFirstLogin(false);
    } catch (err) {
      console.error(err.message);
      alert(t.passwordUpdateError.replace("{message}", err.message));
    }
  };

  return (
    <>
      {/* Layout principal */}
      <PageLayout hideUserMenu={true}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-start justify-center gap-8">
            {/* Imagen lateral */}
            <div className="flex-1 hidden lg:block">
              <div className="h-full max-h-[650px] overflow-hidden rounded-lg">
                <RegisterImageCard />
              </div>
            </div>

            {/* Formulario */}
            <div className="flex-[1.2] flex items-center justify-center">
              <div className="flex-1 min-h-[400px] bg-white dark:bg-gray-800 p-12 shadow-2xl flex flex-col justify-center rounded-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-30 h-30 mb-4">
                    <img
                      src="/LogoColorEMA4.svg"
                      alt={t.altLogo}
                      className="w-30 h-30 object-contain"
                    />
                  </div>
                  <h2 className="text-center text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">
                    {t.title}
                  </h2>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 p-3 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}

                {/* Formulario */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder={t.emailPlaceholder}
                      className="block w-full p-4 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {t.passwordLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder={t.passwordPlaceholder}
                      className="block w-full p-4 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Recordar sesión y olvidé contraseña */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500 dark:bg-gray-700"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                      >
                        {t.rememberMe}
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowResetPopup(true)}
                      className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full font-medium rounded-lg text-sm px-5 py-4 text-center text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 hover:scale-[1.02] transition-all duration-200"
                    >
                      {t.loginButton}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.noAccount}{" "}
                    <Link
                      to="/register"
                      className="font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline"
                    >
                      {t.register}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>

      {/* Popup de restablecimiento */}
      <PasswordModal
        isOpen={showResetPopup}
        onClose={() => {
          setShowResetPopup(false);
          setIsFirstLogin(false);
        }}
        onSubmit={handlePasswordUpdate}
      />

      {/* Modal de bienvenida */}
      <WelcomeModal
        open={showWelcome}
        name={welcomeName}
        message={t.welcomeMessage?.replace("{name}", welcomeName || "usuario")}
        onConfirm={handleWelcomeConfirm}
        onClose={() => setShowWelcome(false)}
      />
    </>
  );
};

export default Login;
