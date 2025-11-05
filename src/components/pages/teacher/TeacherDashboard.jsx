// src/components/pages/teacher/TeacherDashboard.jsx
/**
 * @file TeacherDashboard.jsx
 * @description Dashboard del maestro: cada tarjeta = un curso impartido (widget configurable).
 * - Grid de cursos (cards) con banner, título y chips de bloques visibles para padres.
 * - Editar: banner, subtítulo/etiqueta, tema de color, prioridad y toggles (sílabus/horario/precio/progreso/materiales/mensajes).
 * - Vista previa "como padre".
 * - Todo en 1 archivo. Envuelto por TeacherLayout (usa tu sidebar + navbar).
 */

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Label,
  Modal,
  Select,
  Spinner,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import TeacherLayout from "../../layout/teacher/TeacherLayout";
// 👇 Ruta corregida (sube 3 niveles hasta src/)
import { useAuth } from "../../../contexts/AuthContext";
import { HiCog, HiEye, HiPhotograph, HiRefresh, HiSave } from "react-icons/hi";

// ============================== API helpers inline ==============================
const API_BASE = import.meta.env.VITE_API_URL || "";

async function api(path, { token, method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Error ${res.status}`);
  }
  return res.json().catch(() => ({}));
}

// Cursos del maestro (con config del widget)
async function getTeacherCourses({ token }) {
  try {
    const data = await api("/teacher/courses", { token });
    const list = Array.isArray(data) ? data : data?.items || [];
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      level: c.level ?? "",
      ageRange: c.ageRange ?? "",
      modality: c.modality ?? "academia",
      studentsCount: c.studentsCount ?? 0,
      widget: {
        bannerUrl:
          c.widget?.bannerUrl ||
          "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600&auto=format&fit=crop",
        subtitle: c.widget?.subtitle || c.ageRange || "",
        theme: c.widget?.theme || "teal",
        showSyllabus: c.widget?.showSyllabus ?? true,
        showSchedule: c.widget?.showSchedule ?? true,
        showPrice: c.widget?.showPrice ?? true,
        showProgress: c.widget?.showProgress ?? false,
        showMaterials: c.widget?.showMaterials ?? true,
        showMessages: c.widget?.showMessages ?? false,
        orderPriority: c.widget?.orderPriority ?? 5,
      },
    }));
  } catch {
    return [];
  }
}

// Guardar config de un curso
async function saveCourseWidget({ token, courseId, widget }) {
  return api(`/teacher/courses/${courseId}/widget`, {
    token,
    method: "PUT",
    body: widget,
  });
}

// ============================== Toast minimalista ==============================
function Toast({ type = "success", message = "", onClose }) {
  const color =
    type === "danger" ? "bg-red-600" : type === "warning" ? "bg-amber-500" : "bg-emerald-600";
  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div className={`text-white px-4 py-3 rounded-lg shadow ${color}`}>
        <div className="flex items-center gap-3">
          <span className="font-medium">{message}</span>
          <button onClick={onClose} className="ml-2 rounded bg-white/20 px-2 py-1 text-sm hover:bg-white/30">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================== Card de curso (widget) ==============================
function CourseWidgetCard({ course, onEdit, onPreview }) {
  const ribbonColor =
    course.widget.theme === "teal"
      ? "bg-cyan-600"
      : course.widget.theme === "indigo"
      ? "bg-indigo-600"
      : course.widget.theme === "rose"
      ? "bg-rose-600"
      : "bg-slate-600";

  return (
    <Card className="overflow-hidden shadow-md rounded-2xl border border-slate-200 dark:border-slate-700">
      {/* Banner */}
      <div className="relative h-40 w-full rounded-2xl overflow-hidden">
        <img src={course.widget.bannerUrl} alt={course.name} className="h-full w-full object-cover" loading="lazy" />
        <div className={`${ribbonColor} bg-opacity-90 px-4 py-3 absolute bottom-0 left-0 right-0`}>
          <h3 className="text-white font-semibold text-lg">{course.name}</h3>
          {course.widget.subtitle && <p className="text-white/90 text-sm">{course.widget.subtitle}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-slate-400">
            {course.modality} • {course.level || "—"}
          </div>
          <Badge color="info" className="w-fit">{course.studentsCount} estudiantes</Badge>
        </div>
        <div className="flex gap-2">
          <Button color="light" size="sm" onClick={() => onPreview(course)}>
            <HiEye className="mr-1 h-5 w-5" />
            Vista padre
          </Button>
          <Button color="cyan" size="sm" onClick={() => onEdit(course)}>
            <HiCog className="mr-1 h-5 w-5" />
            Editar
          </Button>
        </div>
      </div>

      {/* Chips resumen de lo visible */}
      <div className="mt-2 flex flex-wrap gap-2">
        {course.widget.showSyllabus && <Badge color="gray">Sílabus</Badge>}
        {course.widget.showSchedule && <Badge color="gray">Horario</Badge>}
        {course.widget.showPrice && <Badge color="gray">Precio</Badge>}
        {course.widget.showProgress && <Badge color="gray">Progreso</Badge>}
        {course.widget.showMaterials && <Badge color="gray">Materiales</Badge>}
        {course.widget.showMessages && <Badge color="gray">Mensajes</Badge>}
      </div>
    </Card>
  );
}

// ============================== Modal de edición ==============================
function EditWidgetModal({ open, onClose, course, onSave, saving }) {
  const [form, setForm] = useState(course?.widget || {});
  useEffect(() => setForm(course?.widget || {}), [course]);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const themes = [
    { value: "teal", label: "Cian/Teal" },
    { value: "indigo", label: "Índigo" },
    { value: "rose", label: "Rosa" },
    { value: "slate", label: "Gris/Slate" },
  ];

  return (
    <Modal show={open} size="lg" onClose={onClose}>
      <Modal.Header>Configurar widget — {course?.name}</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Banner */}
          <div>
            <Label htmlFor="banner" value="URL de imagen (banner)" />
            <div className="mt-1 flex gap-2">
              <TextInput
                id="banner"
                icon={HiPhotograph}
                value={form.bannerUrl || ""}
                onChange={(e) => set({ bannerUrl: e.target.value })}
                placeholder="https://..."
              />
              <Button color="light" onClick={() => set({ bannerUrl: "" })}>
                <HiRefresh className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-700">
              <img
                src={
                  form.bannerUrl ||
                  "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600&auto=format&fit=crop"
                }
                alt="preview"
                className="h-32 w-full object-cover"
              />
            </div>
          </div>

          {/* Texto/tema/prioridad */}
          <div>
            <Label htmlFor="subtitle" value="Subtítulo / etiqueta (ej. 4 - 5 Años)" />
            <TextInput
              id="subtitle"
              className="mt-1"
              value={form.subtitle || ""}
              onChange={(e) => set({ subtitle: e.target.value })}
              placeholder="Ej. 2 - 3 Años | Grupo Vespertino"
            />

            <div className="mt-3">
              <Label htmlFor="theme" value="Tema de color" />
              <Select
                id="theme"
                className="mt-1"
                value={form.theme || "teal"}
                onChange={(e) => set({ theme: e.target.value })}
              >
                {themes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </div>

            <div className="mt-3">
              <Label htmlFor="priority" value="Prioridad (1 = arriba)" />
              <Select
                id="priority"
                className="mt-1"
                value={form.orderPriority ?? 5}
                onChange={(e) => set({ orderPriority: Number(e.target.value) })}
              >
                {[1,2,3,4,5,6,7,8,9].map((n)=> <option key={n} value={n}>{n}</option>)}
              </Select>
            </div>
          </div>

          {/* Toggles de visibilidad */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3 mt-2">
            <ToggleSwitch checked={!!form.showSyllabus}  label="Mostrar Sílabus"   onChange={(v)=>set({showSyllabus:v})}/>
            <ToggleSwitch checked={!!form.showSchedule}  label="Mostrar Horario"   onChange={(v)=>set({showSchedule:v})}/>
            <ToggleSwitch checked={!!form.showPrice}     label="Mostrar Precio"    onChange={(v)=>set({showPrice:v})}/>
            <ToggleSwitch checked={!!form.showProgress}  label="Mostrar Progreso"  onChange={(v)=>set({showProgress:v})}/>
            <ToggleSwitch checked={!!form.showMaterials} label="Mostrar Materiales"onChange={(v)=>set({showMaterials:v})}/>
            <ToggleSwitch checked={!!form.showMessages}  label="Mostrar Mensajes"  onChange={(v)=>set({showMessages:v})}/>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full justify-end gap-3">
          <Button color="gray" onClick={onClose}>Cancelar</Button>
          <Button color="success" onClick={()=>onSave(form)} isProcessing={!!saving} disabled={!!saving}>
            <HiSave className="mr-2 h-5 w-5" /> Guardar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

// ============================== Modal de vista previa (padre) ==============================
function ParentPreviewModal({ open, onClose, course }) {
  if (!course) return null;
  const ribbonColor =
    course.widget.theme === "teal" ? "bg-cyan-600" :
    course.widget.theme === "indigo" ? "bg-indigo-600" :
    course.widget.theme === "rose" ? "bg-rose-600" : "bg-slate-600";

  return (
    <Modal show={open} size="lg" onClose={onClose}>
      <Modal.Header>Vista previa para padres — {course.name}</Modal.Header>
      <Modal.Body>
        <div className="rounded-2xl overflow-hidden border border-slate-600">
          <div className="relative h-44 w-full">
            <img src={course.widget.bannerUrl} alt={course.name} className="h-full w-full object-cover" />
            <div className={`${ribbonColor} px-4 py-3 absolute bottom-0 inset-x-0`}>
              <h3 className="text-white font-semibold text-lg">{course.name}</h3>
              {course.widget.subtitle && <p className="text-white/90 text-sm">{course.widget.subtitle}</p>}
            </div>
          </div>
          <div className="p-4 space-y-2">
            {course.widget.showSyllabus  && <div className="text-slate-200">• Sílabus disponible</div>}
            {course.widget.showSchedule  && <div className="text-slate-200">• Horarios publicados</div>}
            {course.widget.showPrice     && <div className="text-slate-200">• Información de precios</div>}
            {course.widget.showProgress  && <div className="text-slate-200">• Seguimiento de progreso</div>}
            {course.widget.showMaterials && <div className="text-slate-200">• Materiales y recursos</div>}
            {course.widget.showMessages  && <div className="text-slate-200">• Mensajes del profesor</div>}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

// ============================== Página (Dashboard) ==============================
export default function TeacherDashboard() {
  const { token, user } = useAuth?.() ?? { token: null, user: null };

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const teacherName = useMemo(() => user?.name || user?.fullName || "Profesor", [user]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        if (!token) { setErr("Debes iniciar sesión como maestro."); return; }
        const list = await getTeacherCourses({ token });
        if (!alive) return;
        list.sort((a,b)=> (a.widget.orderPriority??99)-(b.widget.orderPriority??99));
        setCourses(list);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "No se pudieron cargar los cursos.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return ()=>{ alive=false; };
  }, [token]);

  const openEdit = (course) => setEditingCourse(course);
  const openPreview = (course) => setPreviewCourse(course);

  const saveEdit = async (form) => {
    if (!editingCourse) return;
    try {
      setSaving(true);
      await saveCourseWidget({ token, courseId: editingCourse.id, widget: form });
      setCourses(prev =>
        prev
          .map(c => c.id === editingCourse.id ? { ...c, widget: { ...form } } : c)
          .sort((a,b)=> (a.widget.orderPriority??99)-(b.widget.orderPriority??99))
      );
      setEditingCourse(null);
      setToast({ type: "success", message: "Widget actualizado." });
    } catch (e) {
      setToast({ type: "danger", message: e?.message || "No se pudo guardar la configuración." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hola, {teacherName}. Personaliza lo que verán los padres por curso.</p>
        </div>

        {/* Estados */}
        {err && (
          <Alert color="failure" className="mb-4">
            <span className="font-semibold">Error:</span> {err}
          </Alert>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-300 gap-3">
            <Spinner size="xl" />
            <span>Cargando cursos…</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-600 p-10 text-center text-slate-400">
            No tienes cursos asignados todavía.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseWidgetCard key={course.id} course={course} onEdit={openEdit} onPreview={openPreview} />
            ))}
          </div>
        )}

        {/* Modales */}
        <EditWidgetModal
          open={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          course={editingCourse}
          onSave={saveEdit}
          saving={saving}
        />
        <ParentPreviewModal
          open={!!previewCourse}
          onClose={() => setPreviewCourse(null)}
          course={previewCourse}
        />

        {/* Toast */}
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    </TeacherLayout>
  );
}