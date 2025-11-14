// src/components/enrollment/CourseSelectionGrid.jsx
import { Alert, Button, Spinner } from "flowbite-react";
import CourseCard from "../ui/CourseCard";

/**
 * Grid de selección de cursos con estados de carga y error
 * @param {Array} courses - Lista de cursos disponibles
 * @param {Object} selected - Curso seleccionado actualmente
 * @param {Function} onSelect - Callback al seleccionar un curso
 * @param {Function} onContinue - Callback al continuar al siguiente paso
 * @param {boolean} loading - Estado de carga
 * @param {string} error - Mensaje de error
 */
export default function CourseSelectionGrid({
  courses,
  selected,
  onSelect,
  onContinue,
  loading,
  error,
}) {
  const canContinue = !!selected;

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-300">
        <Spinner aria-label="Cargando cursos" />
        <span>Cargando cursos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="failure" className="mb-4">
        <span className="font-medium">Error:</span> {error}
      </Alert>
    );
  }

  if (courses.length === 0) {
    return (
      <Alert color="warning" className="mb-6">
        No hay cursos activos disponibles por el momento.
      </Alert>
    );
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            selected={selected?.id === course.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <Button
          color="red"
          onClick={() => onSelect(null)}
          disabled={!selected}
        >
          Quitar selección
        </Button>

        <Button color="cyan" disabled={!canContinue} onClick={onContinue}>
          Continuar
        </Button>
      </div>
    </>
  );
}
