// src/components/pages/app/EnrollmentChild.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Spinner } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useChildren } from "../../../hooks";
import { EnrollmentStepper } from "../../enrollment";
import ChildSelectionCard from "../../enrollment/ChildSelectionCard";

/**
 * Inscripción (Paso 2: Seleccionar hijo - SOLO PADRES)
 * - Muestra lista de hijos del padre
 * - Permite seleccionar a cuál hijo inscribir
 */
export default function EnrollmentChild() {
  const { user } = useAuth?.() ?? { user: null };
  const navigate = useNavigate();
  const location = useLocation();

  // Datos recibidos desde el paso 1
  const { course } = location.state || {};

  const [selected, setSelected] = useState(null);

  // Hook para cargar hijos
  const { children, loading, error } = useChildren();

  const roleText = useMemo(() => {
    const role =
      user?.role?.toLowerCase?.() || user?.roles?.[0]?.toLowerCase?.() || "";
    if (role.includes("parent")) return "Padre";
    return "Usuario";
  }, [user]);

  // Detecta el contexto para construir la ruta del paso 3
  const isParent = location.pathname.startsWith("/parent");
  const schedulePath = isParent ? "/parent/enrollment/schedule" : "schedule";

  if (!course) {
    return (
      <div className="w-full">
        <Alert color="warning" className="mb-6">
          No se encontraron datos del curso. Por favor vuelve al paso anterior.
          <div className="mt-3">
            <Button color="indigo" onClick={() => navigate(-1)}>
              Regresar
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const canContinue = !!selected;

  const handleContinue = () => {
    if (!selected) return;
    navigate(schedulePath, {
      state: {
        course,
        child: selected, // Pasar objeto completo
        kid_id: selected.id, // Mantener por compatibilidad
      },
    });
  };

  return (
    <div className="w-full">
      {/* Título de la página */}
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Inscripción
      </h1>

      {/* Stepper */}
      <EnrollmentStepper currentStep={2} isParent={true} />

      {/* Encabezado contextual */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Paso 2: Selecciona al estudiante
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {roleText}: elige a cuál de tus hijos deseas inscribir en{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {course.name}
          </span>
        </p>
      </div>

      {/* Resumen rápido del curso */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span className="font-medium text-gray-900 dark:text-white">
              {course.name}
            </span>
          </div>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Q{Number(course.cost).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="xl" color="purple" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Alert color="failure" className="mb-6">
          <span className="font-medium">Error:</span> {error}
        </Alert>
      )}

      {/* Grid de hijos */}
      {!loading && !error && (
        <>
          {children.length === 0 ? (
            <Alert color="warning" className="mb-6">
              <div className="flex items-start gap-3">
                <svg
                  className="h-6 w-6 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold">
                    No tienes hijos registrados
                  </h4>
                  <p className="mt-1 text-sm">
                    Debes agregar al menos un hijo para poder inscribirlo en un
                    curso. Ve a tu perfil para gestionar los perfiles de tus
                    hijos.
                  </p>
                  <div className="mt-4">
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => navigate("/parent/profile")}
                    >
                      Ir al perfil
                    </Button>
                  </div>
                </div>
              </div>
            </Alert>
          ) : (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <ChildSelectionCard
                  key={child.id}
                  child={child}
                  selected={selected?.id === child.id}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Información adicional */}
      {!loading && !error && children.length > 0 && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
          <div className="flex gap-3">
            <svg
              className="h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                Información importante
              </h4>
              <p className="mt-1 text-sm text-blue-800 dark:text-blue-400">
                La inscripción se realizará a nombre del hijo seleccionado. En
                el siguiente paso podrás elegir el horario que mejor se ajuste
                a sus necesidades.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de acciones */}
      {!loading && children.length > 0 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {selected
                ? "Revisa tu selección antes de continuar"
                : "Selecciona un hijo para continuar"}
            </span>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <Button
              color="gray"
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Regresar
            </Button>

            <Button
              color="indigo"
              disabled={!canContinue}
              onClick={handleContinue}
              className="flex-1 sm:flex-none"
            >
              Continuar a horarios
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
