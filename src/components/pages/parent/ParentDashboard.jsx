import { useMemo, useState } from "react";
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

/* ======= Paleta + nombres por hijo (coherente en toda la vista) ======= */
const KIDS = {
  daniel: {
    name: "Daniel Chet",
    bar: "bg-violet-500",
    ring: "ring-violet-500",
    text: "text-violet-600",
  },
  david: {
    name: "David Chet",
    bar: "bg-pink-500",
    ring: "ring-pink-500",
    text: "text-pink-600",
  },
};

const today = new Date();
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/* ======= Datos de ejemplo (cada clase ligada a un student) ======= */
const MOCK_CLASSES_TODAY = [
  {
    id: 1,
    student: "daniel",
    title: "Tim's piano class",
    date: today,
    time: "11:00 AM",
    place: "56 Davion Mission Suite 157",
    teacher: "Meaghanberg",
    avatar: "https://i.pravatar.cc/64?img=11",
    status: "normal",
  },
  {
    id: 2,
    student: "david",
    title: "Clase de Canto para Laura",
    date: today,
    time: "13:00 PM",
    place: "853 Moore Flats Suite 158, Sweden",
    teacher: "—",
    avatar: "https://i.pravatar.cc/64?img=12",
    status: "normal",
  },
  {
    id: 3,
    student: "daniel",
    title: "Sofía's Piano Class",
    date: today,
    time: "15:00 PM",
    place: "646 Walter Road Apt. 571, Turks and Caicos Islands",
    teacher: "—",
    avatar: "https://i.pravatar.cc/64?img=13",
    status: "canceled",
  },
];

const MOCK_UPCOMING = [
  ...MOCK_CLASSES_TODAY,
  {
    id: 4,
    student: "david",
    title: "Guitarra Intermedia",
    date: addDays(today, 1),
    time: "09:30 AM",
    place: "Campus Central",
    teacher: "Sr. Pérez",
    avatar: "https://i.pravatar.cc/64?img=14",
    status: "normal",
  },
  {
    id: 5,
    student: "daniel",
    title: "Teoría Musical",
    date: addDays(today, 2),
    time: "10:00 AM",
    place: "Sala 204",
    teacher: "Lic. Gómez",
    avatar: "https://i.pravatar.cc/64?img=15",
    status: "normal",
  },
  {
    id: 6,
    student: "david",
    title: "Ensamble",
    date: addDays(today, 5),
    time: "16:00 PM",
    place: "Auditorio",
    teacher: "—",
    avatar: "https://i.pravatar.cc/64?img=16",
    status: "normal",
  },
];

const MOCK_FEEDBACK = [
  {
    id: 1,
    student: "daniel",
    title: "Piano Class",
    time: "Today 11:00 AM",
    text: "Todo muy bien, solo recuerda mantener el ritmo.",
  },
  {
    id: 2,
    student: "david",
    title: "Canto Class",
    time: "Today 15:00 PM",
    text: "Debes de practicar la entonación.",
  },
];

/* ======= helpers ======= */
function SectionTitle({ children, className = "" }) {
  return (
    <h3 className={`text-sm font-semibold tracking-wide text-black dark:text-gray-400 ${className}`}>
      {children}
    </h3>
  );
}

/** Hace coherente el texto del título con el nombre del hijo. */
function coherentTitle(originalTitle, studentKey) {
  const kid = KIDS[studentKey]?.name ?? "";
  const t = originalTitle.toLowerCase();

  if (t.includes("piano")) return `Clase de Piano de ${kid}`;
  if (t.includes("canto") || t.includes("sing")) return `Clase de Canto de ${kid}`;
  if (t.includes("guitarra")) return `Clase de Guitarra de ${kid}`;
  if (t.includes("teoría")) return `Clase de Teoría Musical de ${kid}`;
  if (t.includes("ensamble")) return `Ensamble — ${kid}`;
  // fallback:
  return `${originalTitle} — ${kid}`;
}

/** Wrapper que dibuja una barra de color al lado derecho para identificar al hijo. */
function ColoredItem({ student, children, className = "" }) {
  const color = KIDS[student]?.bar ?? "bg-cyan-500";
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute right-0 top-2 bottom-2 w-1 rounded ${color}`} />
      {children}
    </div>
  );
}

export default function ParentDashboard() {
  const navigate = useNavigate();

  // filtros (render en sidebar)
  const [kidsFilter, setKidsFilter] = useState({
    all: true,
    daniel: true,
    david: true,
  });

  const onToggleKid = (key) =>
    setKidsFilter((s) => {
      const next = { ...s, [key]: !s[key] };
      if (key === "all") {
        const v = !s.all;
        return { all: v, daniel: v, david: v };
      } else {
        const allOn = next.daniel && next.david;
        return { ...next, all: allOn };
      }
    });

  // Helpers de filtrado
  const studentEnabled = (student) =>
    kidsFilter.all ||
    (student === "daniel" && kidsFilter.daniel) ||
    (student === "david" && kidsFilter.david);

  const classesTodayFiltered = useMemo(
    () => MOCK_CLASSES_TODAY.filter((c) => studentEnabled(c.student)),
    [kidsFilter]
  );

  const upcomingFiltered = useMemo(() => {
    const limit = addDays(today, 3);
    return MOCK_UPCOMING.filter(
      (c) => c.date >= today && c.date < limit && c.status !== "canceled" && studentEnabled(c.student)
    );
  }, [kidsFilter]);

  const feedbackFiltered = useMemo(
    () => MOCK_FEEDBACK.filter((f) => studentEnabled(f.student)),
    [kidsFilter]
  );

  // Notas
  const [notes, setNotes] = useState([{ id: 1, text: "Comprar el libro de Piano para Daniel" }]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [noteText, setNoteText] = useState("");

  const openNew = () => {
    setEditing(null);
    setNoteText("");
    setModalOpen(true);
  };
  const openEdit = (note) => {
    setEditing(note);
    setNoteText(note.text);
    setModalOpen(true);
  };
  const saveNote = () => {
    const txt = noteText.trim();
    if (!txt) return;
    if (!editing) {
      const newId = Math.max(0, ...notes.map((n) => n.id)) + 1;
      setNotes((ns) => [{ id: newId, text: txt }, ...ns]);
    } else {
      setNotes((ns) => ns.map((n) => (n.id === editing.id ? { ...n, text: txt } : n)));
    }
    setModalOpen(false);
    setEditing(null);
    setNoteText("");
  };
  const deleteNote = (id) => setNotes((ns) => ns.filter((n) => n.id !== id));

  return (
    <ParentLayout
      kidsFilter={kidsFilter}
      onToggleKid={onToggleKid}
      kidsLabels={{ daniel: KIDS.daniel.name, david: KIDS.david.name }}
    >
      <div className="px-6 pt-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      <div className="px-6 py-4 grid grid-cols-12 gap-4">
        {/* Columna izquierda: Clases de Hoy */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="h-full pt-0">
            <SectionTitle className="text-center font-bold text-xl mt-0">Clases de Hoy</SectionTitle>
            <div className="border-b border-gray-200 dark:border-gray-700 mx-2" />

            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 px-1">
              {classesTodayFiltered.map((c, idx) => {
                const ring = KIDS[c.student]?.ring ?? "ring-cyan-500";
                const label = coherentTitle(c.title, c.student);
                return (
                  <ColoredItem key={c.id} student={c.student} className={`${idx === 0 ? "pt-4" : "pt-4"} pb-4`}>
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full ring-2 ${ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900`}>
                        <Avatar img={c.avatar} rounded />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">{label}</p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Today {c.time}
                          {c.status === "canceled" && <Badge color="failure" size="xs" className="ml-2">CANCELED</Badge>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{c.place}</p>
                      </div>
                    </div>
                  </ColoredItem>
                );
              })}
              {classesTodayFiltered.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 px-2 pb-4">No hay clases para el filtro seleccionado.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Columna central + derecha */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 sm:p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Centro */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Hero resumen próximos 3 días */}
                <Card className="relative overflow-hidden cursor-pointer" onClick={() => navigate("/calendar")}>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('RecitalInicio.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative py-10 px-6 sm:px-10">
                    <p className="text-2xl sm:text-3xl font-semibold text-white leading-snug">
                      En los próximos <span className="text-white/90 font-bold">3</span> días tienes{" "}
                      <span className="text-red-400 font-extrabold">{upcomingFiltered.length}</span> clases
                    </p>
                    <Button className="mt-4" onClick={() => navigate("/calendar")}>
                      Ver calendario
                    </Button>
                  </div>
                </Card>

                {/* Retroalimentación */}
                <Card>
                  <SectionTitle>Retroalimentación por profesores</SectionTitle>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {feedbackFiltered.map((f) => {
                      const label = coherentTitle(f.title, f.student);
                      const tagColor = KIDS[f.student]?.text ?? "text-cyan-600";
                      return (
                        <ColoredItem key={f.id} student={f.student} className="py-4">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {label} <span className={`ml-2 text-xs font-semibold ${tagColor}`}>({KIDS[f.student].name})</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{f.time}</p>
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{f.text}</p>
                        </ColoredItem>
                      );
                    })}
                    {feedbackFiltered.length === 0 && (
                      <div className="py-6 text-sm text-gray-500 dark:text-gray-400">Sin retroalimentación para el filtro seleccionado.</div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Derecha: Anotaciones */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between">
                  <SectionTitle className="m-0">Anotaciones</SectionTitle>
                  <Button size="xs" onClick={openNew}>+ Add new note</Button>
                </div>

                <div className="space-y-3">
                  {notes.map((n) => (
                    <Card key={n.id} className="p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-200">{n.text}</p>
                      <div className="mt-3 flex gap-2">
                        <Button size="xs" color="light" onClick={() => openEdit(n)} title="Edit">Edit</Button>
                        <Button size="xs" color="failure" onClick={() => deleteNote(n.id)} title="Delete">Delete</Button>
                      </div>
                    </Card>
                  ))}
                  {notes.length === 0 && (
                    <Card className="p-6 text-sm text-gray-500 dark:text-gray-400">
                      No hay anotaciones todavía.
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
        <ModalHeader>{editing ? "Editar nota" : "Nueva nota"}</ModalHeader>
        <ModalBody>
          <Textarea
            rows={6}
            placeholder="Escribe tu nota aquí..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={saveNote}>{editing ? "Guardar cambios" : "Agregar nota"}</Button>
          <Button color="gray" onClick={() => setModalOpen(false)}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </ParentLayout>
  );
}