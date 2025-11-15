// src/components/pages/teacher/TeacherDashboard.jsx
/**
 * @file TeacherDashboard.jsx
 * @description Dashboard del maestro - Vista simplificada con cards de cursos
 * 
 * TODO INTEGRADO EN UN SOLO ARCHIVO:
 * - Dashboard con grid de cursos
 * - Cards con banner y overlay
 * - Navegación a detalle de curso
 * - Manejo de estados (loading, error, empty)
 * - Datos quemados (mock) para testing
 * - Diseño responsive
 * 
 * @author EMA Frontend Team
 * @version 3.0.0
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner, Alert } from "flowbite-react";
import TeacherLayout from "../../layout/teacher/TeacherLayout";

// ============================== DATOS QUEMADOS (MOCK DATA) ==============================
const MOCK_COURSES = [
  {
    id: 1,
    name: "Estimulación Musical",
    subtitle: "2 - 3 Años",
    bannerUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1600&auto=format&fit=crop",
    theme: "cyan",
  },
  {
    id: 2,
    name: "Estimulación Musical",
    subtitle: "4 - 5 Años",
    bannerUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop",
    theme: "cyan",
  },
  {
    id: 3,
    name: "Piano",
    subtitle: "Nivel Básico",
    bannerUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1600&auto=format&fit=crop",
    theme: "cyan",
  },
  {
    id: 4,
    name: "Canto",
    subtitle: "Nivel Intermedio",
    bannerUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1600&auto=format&fit=crop",
    theme: "cyan",
  },
];

// ============================== CONFIGURACIÓN DE COLORES ==============================
const THEME_COLORS = {
  cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600",
  teal: "bg-gradient-to-br from-teal-500 to-teal-600",
  blue: "bg-gradient-to-br from-blue-500 to-blue-600",
  indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600",
  purple: "bg-gradient-to-br from-purple-500 to-purple-600",
  pink: "bg-gradient-to-br from-pink-500 to-pink-600",
};

// ============================== COMPONENTE DE CARD ==============================
function CourseCard({ course, onClick }) {
  const gradientClass = THEME_COLORS[course.theme] || THEME_COLORS.cyan;

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0"
      onClick={() => onClick(course)}
    >
      <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-lg">
        {/* Banner Image */}
        <img
          src={course.bannerUrl}
          alt={course.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay oscuro para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Texto del curso */}
        <div className={`absolute bottom-0 left-0 right-0 ${gradientClass} px-5 py-4`}>
          <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight">
            {course.name}
          </h3>
          {course.subtitle && (
            <p className="text-white/95 text-sm sm:text-base mt-1 font-medium">
              {course.subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

// ============================== COMPONENTE PRINCIPAL ==============================
export default function TeacherDashboard() {
  const navigate = useNavigate();
  
  // Estados
  const [loading] = useState(false); // Cambia a true si quieres ver el loading
  const [error] = useState(""); // Pon un mensaje si quieres ver el error
  const [courses] = useState(MOCK_COURSES);

  // Manejar click en curso
  const handleCourseClick = (course) => {
    console.log("Curso seleccionado:", course);
    // Navegar a la vista del curso específico
    // navigate(`/teacher/courses/${course.id}`);
    
    // Por ahora solo muestra una alerta
    alert(`Navegando al curso: ${course.name}`);
  };

  return (
    <TeacherLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selecciona un curso para ver más detalles y gestionar su contenido
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert color="failure" className="mb-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Spinner size="xl" color="info" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Cargando tus cursos...
            </p>
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No tienes cursos asignados
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Contacta al administrador para que te asignen cursos
            </p>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={handleCourseClick}
              />
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}