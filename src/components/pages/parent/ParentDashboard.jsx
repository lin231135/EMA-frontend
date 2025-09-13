// src/components/pages/parent/ParentDashboard.jsx
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

const today = new Date();
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

// Nota: asociamos cada clase a un estudiante para que el filtro tenga sentido,
// sin cambiar los títulos que aparecen en tu mock.
const MOCK_CLASSES_TODAY = [
  {
    id: 1,
    student: "daniel", // Daniel Chet
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
    student: "david", // David Chet
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
  { id: 1, student: "daniel", title: "Piano Class", time: "Today 11:00 AM", text: "Todo muy bien, solo recuerda mantener el ritmo." },
  { id: 2, student: "david", title: "Canto Class", time: "Today 15:00 PM", text: "Debes de practicar la entonación." },
];

function SectionTitle({ children, className = "" }) {
  return (
    <h3 className={`text-sm font-semibold tracking-wide text-black dark:text-gray-400 ${className}`}>
      {children}
    </h3>
  );
}

export default function ParentDashboard() {
  const navigate = useNavigate();

  // Estado de filtros (renderizado en el sidebar)
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
    kidsFilter.all || (student === "daniel" && kidsFilter.daniel) || (student === "david" && kidsFilter.david);

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

  // Notas (Anotaciones)
  const [notes, setNotes] = useState([{ id: 1, text: "DEBO DE MANTENER EL RITMO EN LAS CANCIONES" }]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [noteText, setNoteText] = useState("");

  const openNew = () => { setEditing(null); setNoteText(""); setModalOpen(true); };
  const openEdit = (note) => { setEditing(note); setNoteText(note.text); setModalOpen(true); };
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
      kidsLabels={{ daniel: "Daniel Chet", david: "David Chet" }}
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
              {classesTodayFiltered.map((c, idx) => (
                <div key={c.id} className={`flex items-start gap-3 ${idx === 0 ? "pt-4" : "pt-4"} pb-4`}>
                  <Avatar img={c.avatar} rounded />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">{c.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Today {c.time}
                      {c.status === "canceled" && (
                        <Badge color="failure" size="xs" className="ml-2">CANCELED</Badge>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{c.place}</p>
                  </div>
                </div>
              ))}
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
                    {feedbackFiltered.map((f) => (
                      <div key={f.id} className="py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{f.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{f.time}</p>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{f.text}</p>
                      </div>
                    ))}
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
                        <Button size="xs" color="light" onClick={() => openEdit(n)} title="Edit">✏️</Button>
                        <Button size="xs" color="failure" onClick={() => deleteNote(n.id)} title="Delete">🗑️</Button>
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
          <Textarea rows={6} placeholder="Escribe tu nota aquí..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={saveNote}>{editing ? "Guardar cambios" : "Agregar nota"}</Button>
          <Button color="gray" onClick={() => setModalOpen(false)}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </ParentLayout>
  );
}