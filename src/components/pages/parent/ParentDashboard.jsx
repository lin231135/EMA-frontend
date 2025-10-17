// src/components/pages/parent/ParentDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Badge,
  Avatar,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "flowbite-react";
import ParentLayout from "../../layout/parent/ParentLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

/* ======= Config ======= */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ======= Paleta de colores por hijo (determinística por índice) ======= */
const COLOR_PALETTE = [
  { bar: "bg-violet-500", ring: "ring-violet-500", text: "text-violet-600" },
  { bar: "bg-pink-500", ring: "ring-pink-500", text: "text-pink-600" },
  { bar: "bg-cyan-500", ring: "ring-cyan-500", text: "text-cyan-600" },
  { bar: "bg-emerald-500", ring: "ring-emerald-500", text: "text-emerald-600" },
  { bar: "bg-amber-500", ring: "ring-amber-500", text: "text-amber-600" },
  { bar: "bg-sky-500", ring: "ring-sky-500", text: "text-sky-600" },
];
const colorForIndex = (i) => COLOR_PALETTE[((i ?? 0) + COLOR_PALETTE.length) % COLOR_PALETTE.length];

/* ======= helpers UI ======= */
function SectionTitle({ children, className = "" }) {
  return (
    <h3 className={`text-sm font-semibold tracking-wide text-black dark:text-gray-400 ${className}`}>
      {children}
    </h3>
  );
}
function ColoredItem({ colorClass, children, className = "" }) {
  const color = colorClass?.bar ?? "bg-cyan-500";
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute right-0 top-2 bottom-2 w-1 rounded ${color}`} />
      {children}
    </div>
  );
}

function formatDate(d, lang = "es") {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

/* ======= Componente ======= */
export default function ParentDashboard() {
  const navigate = useNavigate();
  const { lang, token } = useAuth();
  const t = translations[lang]?.parentDashboard || translations.es.parentDashboard;

  // Perfil del padre (para mostrar su nombre)
  const [parentName, setParentName] = useState("");

  // Hijos reales
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [error, setError] = useState(null);

  // Estilos por hijo
  const [kidStyles, setKidStyles] = useState({}); // { 'kid-<id>': {bar, ring, text} }

  // Filtros
  const [kidsFilter, setKidsFilter] = useState({ all: true });

  const onToggleKid = (key) =>
    setKidsFilter((s) => {
      const next = { ...s, [key]: !s[key] };
      if (key === "all") {
        const v = !s.all;
        const every = Object.fromEntries(Object.keys(s).map((k) => [k, v]));
        return { ...every, all: v };
      } else {
        const allOn = Object.entries(next)
          .filter(([k]) => k !== "all")
          .every(([, val]) => val);
        return { ...next, all: allOn };
      }
    });

  // Notas (local por ahora)
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [selectedKidKey, setSelectedKidKey] = useState(null);

  // Clases (datos reales desde API)
  const [classesTodayAll, setClassesTodayAll] = useState([]); // sin filtrar
  const [upcomingAll, setUpcomingAll] = useState([]); // sin filtrar
  const [loadingClasses, setLoadingClasses] = useState(false);

  const openNew = () => {
    setEditing(null);
    setNoteText("");
    const firstKey = children[0] ? `kid-${children[0].id}` : null;
    setSelectedKidKey(firstKey);
    setModalOpen(true);
  };
  const openEdit = (note) => {
    setEditing(note);
    setNoteText(note.text);
    setSelectedKidKey(note.kidKey || null);
    setModalOpen(true);
  };
  const saveNote = () => {
    const txt = noteText.trim();
    if (!txt || !selectedKidKey) return;
    if (!editing) {
      const newId = Math.max(0, ...notes.map((n) => n.id)) + 1;
      setNotes((ns) => [{ id: newId, text: txt, kidKey: selectedKidKey }, ...ns]);
    } else {
      setNotes((ns) => ns.map((n) => (n.id === editing.id ? { ...n, text: txt, kidKey: selectedKidKey } : n)));
    }
    setModalOpen(false);
    setEditing(null);
    setNoteText("");
    setSelectedKidKey(null);
  };
  const deleteNote = (id) => setNotes((ns) => ns.filter((n) => n.id !== id));

  // Cargar perfil del padre (para mostrar su nombre real)
  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const res = await fetch(`${API}/parents/profiles`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        const name = data?.parent?.name || "";
        setParentName(name);
      } catch {
        if (!mounted) return;
        setParentName("");
      }
    }
    loadProfile();
    return () => { mounted = false; };
  }, [token]);

  // Cargar hijos reales
  useEffect(() => {
    let isMounted = true;
    async function loadChildren() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/parents/dashboard/children`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!isMounted) return;

        const kids = Array.isArray(data.children) ? data.children : [];
        setChildren(kids);

        const dynamicFilter = { all: true };
        const styles = {};
        kids.forEach((kid, idx) => {
          const key = `kid-${kid.id}`;
          dynamicFilter[key] = true;
          styles[key] = colorForIndex(idx);
        });
        setKidsFilter(dynamicFilter);
        setKidStyles(styles);

        if (!selectedKidKey && kids[0]) setSelectedKidKey(`kid-${kids[0].id}`);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Error");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadChildren();
    return () => { isMounted = false; };
  }, [token]);

  // Cargar clases reales (hoy y próximos) una vez tengamos hijos
  useEffect(() => {
    let alive = true;
    async function loadClasses() {
      if (!token) return;
      if (!children || children.length === 0) {
        setClassesTodayAll([]);
        setUpcomingAll([]);
        return;
      }
      setLoadingClasses(true);
      try {
        const kidIds = children.map((k) => k.id).join(",");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Hoy
        const todayRes = await fetch(
          `${API}/parents/dashboard/today-classes?kid_ids=${encodeURIComponent(kidIds)}`,
          { headers }
        );
        // Próximos 3 días
        const nextRes = await fetch(
          `${API}/parents/dashboard/next-classes?days=3&kid_ids=${encodeURIComponent(kidIds)}`,
          { headers }
        );

        const todayJson = todayRes.ok ? await todayRes.json() : { classes: [] };
        const nextJson = nextRes.ok ? await nextRes.json() : { classes: [] };

        if (!alive) return;
        setClassesTodayAll(Array.isArray(todayJson.classes) ? todayJson.classes : []);
        setUpcomingAll(Array.isArray(nextJson.classes) ? nextJson.classes : []);
      } catch {
        if (!alive) return;
        setClassesTodayAll([]);
        setUpcomingAll([]);
      } finally {
        if (alive) setLoadingClasses(false);
      }
    }
    loadClasses();
    return () => { alive = false; };
  }, [children, token]);

  // Labels visibles en el sidebar
  const kidsLabels = useMemo(() => {
    const labels = {};
    children.forEach((k) => {
      labels[`kid-${k.id}`] = k.name;
    });
    return labels;
  }, [children]);

  // Filtro aplicado a clases (según checkboxes)
  const classesTodayFiltered = useMemo(() => {
    if (!classesTodayAll?.length) return [];
    if (kidsFilter.all) return classesTodayAll;
    return classesTodayAll.filter((c) => kidsFilter[`kid-${c.kid_id}`]);
  }, [classesTodayAll, kidsFilter]);

  const upcomingFiltered = useMemo(() => {
    if (!upcomingAll?.length) return [];
    if (kidsFilter.all) return upcomingAll;
    return upcomingAll.filter((c) => kidsFilter[`kid-${c.kid_id}`]);
  }, [upcomingAll, kidsFilter]);

  // Aún sin endpoints de feedback -> estado vacío (sin quemar)
  const feedbackFiltered = [];

  return (
    <ParentLayout
      kidsFilter={kidsFilter}
      onToggleKid={onToggleKid}
      kidsLabels={kidsLabels}
      parentName={parentName}
    >
      <div className="px-2 sm:px-4 pt-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {loading
            ? (lang === "es" ? "Cargando hijos..." : "Loading children...")
            : error
              ? (lang === "es" ? "Error al cargar hijos." : "Failed to load children.")
              : (lang === "es"
                ? `Tienes ${children.length} ${children.length === 1 ? "hijo inscrito" : "hijos inscritos"}.`
                : `You have ${children.length} enrolled ${children.length === 1 ? "child" : "children"}.`)}
        </p>
      </div>

      <div className="px-2 sm:px-4 py-4 grid grid-cols-12 gap-4">
        {/* Columna izquierda: Clases de Hoy + Próximas (juntas) */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="h-full pt-0">
            <SectionTitle className="text-center font-bold text-xl mt-0">{t.todaysClasses}</SectionTitle>
            <div className="border-b border-gray-200 dark:border-gray-700 mx-2" />

            {/* BLOQUE: Hoy */}
            <div className="px-1">
              <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-3 mb-2">
                {lang === "es" ? "Hoy" : "Today"}
              </p>

              {loadingClasses && (
                <p className="text-xs text-gray-500 dark:text-gray-400 py-2">
                  {lang === "es" ? "Cargando clases..." : "Loading classes..."}
                </p>
              )}

              {!loadingClasses && classesTodayFiltered.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 py-2">
                  {t.empty?.noClassesFiltered || (lang === "es" ? "No hay clases para hoy." : "No classes for today.")}
                </p>
              )}

              {!loadingClasses &&
                classesTodayFiltered.map((cls, idx) => {
                  const key = `kid-${cls.kid_id}`;
                  const childIdxRaw = children.findIndex((k) => k.id === cls.kid_id);
                  const childIdx = childIdxRaw < 0 ? 0 : childIdxRaw;
                  const style = kidStyles[key] || colorForIndex(childIdx);

                  return (
                    <div key={`${cls.id}-${idx}`} className="py-3 border-t first:border-t-0 dark:border-gray-700">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full ring-2 ${style.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900`}>
                          <Avatar img={null} rounded />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${style.bar}`} />
                            {cls.kid_name}
                            <Badge size="xs" color="info">{cls.course_name}</Badge>
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {lang === "es" ? "Horario:" : "Time:"} {cls.start_time}–{cls.end_time}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {lang === "es" ? "Maestro:" : "Teacher:"} {cls.teacher_name}
                          </p>
                          <div className="mt-1">
                            <Badge size="xs" color={cls.status === "programada" ? "success" : "gray"}>
                              {cls.status}
                            </Badge>{" "}
                            <Badge size="xs" color="purple">{cls.modality}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Separador */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-3 mx-2" />

            {/* BLOQUE: Próximas 3 días */}
            <div className="px-1 pb-4">
              <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1 mb-2">
                {lang === "es" ? "Próximas (3 días)" : "Upcoming (3 days)"}
              </p>

              {loadingClasses && (
                <p className="text-xs text-gray-500 dark:text-gray-400 py-2">
                  {lang === "es" ? "Cargando próximas clases..." : "Loading upcoming classes..."}
                </p>
              )}

              {!loadingClasses && upcomingFiltered.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 py-2">
                  {lang === "es" ? "No hay clases en los próximos días." : "No upcoming classes."}
                </p>
              )}

              {!loadingClasses &&
                upcomingFiltered.map((cls, idx) => {
                  const key = `kid-${cls.kid_id}`;
                  const childIdxRaw = children.findIndex((k) => k.id === cls.kid_id);
                  const childIdx = childIdxRaw < 0 ? 0 : childIdxRaw;
                  const style = kidStyles[key] || colorForIndex(childIdx);

                  return (
                    <div key={`${cls.id}-${idx}`} className="py-3 border-t first:border-t-0 dark:border-gray-700">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full ring-2 ${style.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900`}>
                          <Avatar img={null} rounded />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${style.bar}`} />
                            {cls.kid_name}
                            <Badge size="xs" color="info">{cls.course_name}</Badge>
                            <Badge size="xs" color="indigo">{formatDate(cls.date, lang)}</Badge>
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {lang === "es" ? "Horario:" : "Time:"} {cls.start_time}–{cls.end_time}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {lang === "es" ? "Maestro:" : "Teacher:"} {cls.teacher_name}
                          </p>
                          <div className="mt-1">
                            <Badge size="xs" color={cls.status === "programada" ? "success" : "gray"}>
                              {cls.status}
                            </Badge>{" "}
                            <Badge size="xs" color="purple">{cls.modality}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>

        {/* Columna central + derecha */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 sm:p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Centro */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Hero próximos 3 días (se mantiene el conteo) */}
                <Card className="relative overflow-hidden cursor-pointer" onClick={() => navigate("/parent/ParentCalendar")}>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('RecitalInicio.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative py-10 px-6 sm:px-10">
                    <p className="text-2xl sm:text-3xl font-semibold text-white leading-snug">
                      {lang === 'es' ? (
                        <>
                          En los próximos <span className="text-white/90 font-bold">3</span> días tienes{" "}
                          <span className="text-red-400 font-extrabold">{upcomingFiltered.length}</span> clases
                        </>
                      ) : (
                        <>
                          In the next <span className="text-white/90 font-bold">3</span> days you have{" "}
                          <span className="text-red-400 font-extrabold">{upcomingFiltered.length}</span> classes
                        </>
                      )}
                    </p>
                    <Button className="mt-4" onClick={() => navigate("/parent/ParentCalendar")}>
                      {t.viewCalendar}
                    </Button>
                  </div>
                </Card>

                {/* Resumen de hijos (dinámico, filtrable) */}
                <Card>
                  <SectionTitle className="mb-3">
                    {lang === "es" ? "Hijos inscritos" : "Enrolled children"}
                  </SectionTitle>

                  {loading && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lang === "es" ? "Cargando..." : "Loading..."}
                    </p>
                  )}

                  {error && (
                    <p className="text-sm text-red-500">
                      {lang === "es" ? "No se pudieron cargar los hijos." : "Failed to load children."}
                    </p>
                  )}

                  {!loading && !error && children.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lang === "es" ? "No tienes hijos registrados aún." : "You don’t have children registered yet."}
                    </p>
                  )}

                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {children
                      .filter((kid) => (kidsFilter.all ? true : !!kidsFilter[`kid-${kid.id}`]))
                      .map((kid, idx) => {
                        const kidKey = `kid-${kid.id}`;
                        const style = kidStyles[kidKey] || colorForIndex(idx);
                        return (
                          <ColoredItem key={kid.id} colorClass={style} className="py-4">
                            <div className="flex items-start gap-3">
                              <div className={`rounded-full ring-2 ${style.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900`}>
                                <Avatar img={null} rounded />
                              </div>

                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                  {kid.name}
                                  <Badge size="xs" color={kid.is_active ? "success" : "gray"}>
                                    {kid.is_active ? (lang === "es" ? "Activo" : "Active") : (lang === "es" ? "Inactivo" : "Inactive")}
                                  </Badge>
                                  <Badge size="xs" color={kid.is_solvent ? "success" : "warning"}>
                                    {kid.is_solvent ? (lang === "es" ? "Solvente" : "In good standing") : (lang === "es" ? "Pendiente" : "Pending")}
                                  </Badge>
                                </p>
                                {kid.created_at && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {lang === "es" ? "Inscrito desde " : "Enrolled since "}
                                    {new Date(kid.created_at).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </ColoredItem>
                        );
                      })}
                  </div>
                </Card>

                {/* Retroalimentación (vacío por ahora) */}
                <Card>
                  <SectionTitle>{lang === "es" ? "Retroalimentación de profesores" : "Teacher feedback"}</SectionTitle>
                  {feedbackFiltered.length === 0 && (
                    <div className="py-6 text-sm text-gray-500 dark:text-gray-400">
                      {lang === "es" ? "Aún no hay retroalimentación." : "No feedback yet."}
                    </div>
                  )}
                </Card>
              </div>

              {/* Derecha: Anotaciones (local por ahora) */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between">
                  <SectionTitle className="m-0">{t.notes.title}</SectionTitle>
                  <Button size="xs" onClick={openNew}>{t.notes.addNew}</Button>
                </div>

                <div className="space-y-3">
                  {notes.map((n) => {
                    const style = kidStyles[n.kidKey] || colorForIndex(0);
                    const kidName = kidsLabels[n.kidKey] || (lang === "es" ? "Hijo" : "Child");
                    return (
                      <Card key={n.id} className="p-4 relative">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar} rounded-l-lg`}></div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${style.bar}`}></div>
                          <span className={`text-xs font-medium ${style.text}`}>{kidName}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-200 ml-5">{n.text}</p>
                        <div className="mt-3 flex gap-2 ml-5">
                          <Button size="xs" color="light" onClick={() => openEdit(n)} title={t.notes.edit}>{t.notes.edit}</Button>
                          <Button size="xs" color="failure" onClick={() => deleteNote(n.id)} title={t.notes.delete}>{t.notes.delete}</Button>
                        </div>
                      </Card>
                    );
                  })}
                  {notes.length === 0 && (
                    <Card className="p-6 text-sm text-gray-500 dark:text-gray-400">
                      {t.empty?.noNotes || (lang === "es" ? "Aún no hay notas." : "No notes yet.")}
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de nota */}
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader>{editing ? t.notes.editNote : t.notes.newNote}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Selector de estudiante dinámico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {t.notes.student}
              </label>
              <div className="flex flex-wrap gap-3">
                {children.map((kid, idx) => {
                  const key = `kid-${kid.id}`;
                  const style = kidStyles[key] || colorForIndex(idx);
                  const active = selectedKidKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKidKey(key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                        active
                          ? `border-current ${style.text} bg-opacity-10`
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${style.bar}`}></div>
                      <span className="text-sm font-medium">{kid.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea para la nota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {t.notes.note}
              </label>
              <Textarea
                rows={6}
                placeholder={t.notes.placeholder}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={saveNote} disabled={!selectedKidKey}>
            {editing ? t.notes.save : t.notes.add}
          </Button>
          <Button color="gray" onClick={() => setModalOpen(false)}>{t.notes.cancel}</Button>
        </ModalFooter>
      </Modal>
    </ParentLayout>
  );
}