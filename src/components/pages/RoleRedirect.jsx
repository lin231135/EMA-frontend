import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Ejemplo: el rol lo podrías obtener de un contexto, localStorage o API
const getUserRole = () => {
  return localStorage.getItem("role") || "guest";
};

export default function RoleRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = getUserRole();

    if (role === "admin") {
      navigate("/dashboard");
    } else if (role === "student") {
      navigate("/courses");
    } else if (role === "teacher") {
      navigate("/manage");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null; // este componente solo redirige
}
