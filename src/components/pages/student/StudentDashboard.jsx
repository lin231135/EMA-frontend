// src/components/pages/student/StudentDashboard.jsx
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
  Tooltip,
} from "flowbite-react";
import StudentLayout from "../../layout/student/StudentLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

const today = new Date();
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const MOCK_CLASSES_TODAY = [
  { id: 1, title: "Tim's piano class", date: today, time: "11:00 AM", place: "56 Davion Mission Suite 157", teacher: "Meaghanberg", avatar: "https://i.pravatar.cc/64?img=11", status: "normal" },
  { id: 2, title: "Clase de Canto para Laura", date: today, time: "13:00 PM", place: "853 Moore Flats Suite 158, Sweden", teacher: "—", avatar: "https://i.pravatar.cc/64?img=12", status: "normal" },
  { id: 3, title: "Sofía's Piano Class", date: today, time: "15:00 PM", place: "646 Walter Road Apt. 571, Turks and Caicos Islands", teacher: "—", avatar: "https://i.pravatar.cc/64?img=13", status: "canceled" },
];

const MOCK_UPCOMING = [
  ...MOCK_CLASSES_TODAY,
  { id: 4, title: "Guitarra Intermedia", date: addDays(today, 1), time: "09:30 AM", place: "Campus Central", teacher: "Sr. Pérez", avatar: "https://i.pravatar.cc/64?img=14", status: "normal" },
  { id: 5, title: "Teoría Musical", date: addDays(today, 2), time: "10:00 AM", place: "Sala 204", teacher: "Lic. Gómez", avatar: "https://i.pravatar.cc/64?img=15", status: "normal" },
  { id: 6, title: "Ensamble", date: addDays(today, 5), time: "16:00 PM", place: "Auditorio", teacher: "—", avatar: "https://i.pravatar.cc/64?img=16", status: "normal" },
];

const MOCK_FEEDBACK = [
  { id: 1, title: "Piano Class", time: "Today 11:00 AM", text: "Todo muy bien, solo recuerda mantener el ritmo." },
  { id: 2, title: "Canto Class", time: "Today 15:00 PM", text: "Debes de practicar la entonación." },
];

function SectionTitle({ children, className = "" }) {
  return (
    <h3 className={`text-sm font-semibold tracking-wide text-black dark:text-gray-400 ${className}`}>
      {children}
    </h3>
  );
}

export default function StudentDashboard({
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
}) {
  const navigate = useNavigate();
  const { lang } = useAuth();
  const t = translations[lang].studentDashboard.studentDashboard;

  const DAYS_WINDOW = 3;

  const classesNext3Days = useMemo(() => {
    const limit = addDays(today, DAYS_WINDOW);
    return MOCK_UPCOMING.filter(
      (c) => c.date >= today && c.date < limit && c.status !== "canceled"
    );
  }, []);

  // ===== Notas  =====
  const [notes, setNotes] = useState([
    { id: 1, text: "DEBO DE MANTENER EL RITMO EN LAS CANCIONES" },
  ]);
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

  const saveNote = async () => {
    const txt = noteText.trim();
    if (!txt) return;

    if (!editing) {
      // Crear
      const newId = Math.max(0, ...notes.map((n) => n.id)) + 1;
      const newNote = { id: newId, text: txt };
      setNotes((ns) => [newNote, ...ns]);

      if (typeof onCreateNote === "function") {
        try {
          await onCreateNote(txt);
        } catch (_) {
        }
      }
    } else {
      // Editar
      setNotes((ns) => ns.map((n) => (n.id === editing.id ? { ...n, text: txt } : n)));

      if (typeof onUpdateNote === "function") {
        try {
          await onUpdateNote(editing.id, txt);
        } catch (_) {
        }
      }
    }

    setModalOpen(false);
    setEditing(null);
    setNoteText("");
  };

  const deleteNote = async (id) => {
    setNotes((ns) => ns.filter((n) => n.id !== id));
    if (typeof onDeleteNote === "function") {
      try {
        await onDeleteNote(id);
      } catch (_) {
      }
    }
  };

  return (
    <StudentLayout>
      <div className="px-6 pt-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
      </div>

      <div className="px-6 py-4 grid grid-cols-12 gap-4">
        {/*  Clases de hoy */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="h-full pt-0">
            <SectionTitle className="text-center font-bold text-xl mt-0">
              {t.todayClasses}
            </SectionTitle>
            <div className="border-b border-gray-200 dark:border-gray-700 mx-2" />
            <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 px-1">
              {MOCK_CLASSES_TODAY.map((c, idx) => (
                <div key={c.id} className={`flex items-start gap-3 ${idx === 0 ? "pt-4" : "pt-4"} pb-4`}>
                  <Avatar img={c.avatar} rounded />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">{c.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {/* "Today"  */}
                      {"Today"} {c.time}
                      {c.status === "canceled" && (
                        <Badge color="failure" size="xs" className="ml-2">
                          {t.actions.canceled}
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{c.place}</p>
                    {c.teacher !== "—" && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{c.teacher}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CONTENEDOR BLANCO  */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 sm:p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Centro */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <Card className="relative overflow-hidden cursor-pointer" onClick={() => navigate("/calendar")}>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('RecitalInicio.jpg')" }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative py-10 px-6 sm:px-10">
                    <p className="text-2xl sm:text-3xl font-semibold text-white leading-snug">
                      {
                        t.upcomingClassesText
                          .replace("{days}", DAYS_WINDOW)
                          .replace("{count}", classesNext3Days.length)
                      }
                    </p>
                    <Button className="mt-4" onClick={() => navigate("/calendar")}>
                      {t.viewCalendar}
                    </Button>
                  </div>
                </Card>

                <Card>
                  <SectionTitle>{t.feedbackTitle}</SectionTitle>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {MOCK_FEEDBACK.map((f) => (
                      <div key={f.id} className="py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{f.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{f.time}</p>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{f.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Notas */}
              <div className="col-span-12 lg:col-span-4">
                <Card>
                  <div className="flex items-center justify-between">
                    <SectionTitle>{t.notesTitle}</SectionTitle>
                    <Button size="xs" onClick={openNew}>{t.addNote}</Button>
                  </div>

                  <div className="space-y-4 mt-2">
                    {notes.map((n) => (
                      <div key={n.id} className="relative rounded-xl bg-sky-50 dark:bg-slate-800 p-4 shadow-sm">
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{n.text}</p>
                        <div className="flex gap-2 justify-end mt-4">
                          <Tooltip content={t.actions.edit}>
                            <Button size="xs" color="light" onClick={() => openEdit(n)} aria-label={t.actions.edit}>
                              {/* Icono Editar */}
                              <svg
                                className="w-5 h-5 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                />
                              </svg>
                              <span className="sr-only">{t.actions.edit}</span>
                            </Button>
                          </Tooltip>
                          <Tooltip content={t.actions.delete}>
                            <Button size="xs" color="light" onClick={() => deleteNote(n.id)} aria-label={t.actions.delete}>
                              {/* Icono Eliminar */}
                              <svg
                                className="w-5 h-5 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                                />
                              </svg>
                              <span className="sr-only">{t.actions.delete}</span>
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal nota */}
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader>{editing ? t.modal.edit : t.modal.new}</ModalHeader>
        <ModalBody>
          <Textarea
            rows={6}
            placeholder={t.modal.placeholder}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={saveNote}>{editing ? t.modal.saveChanges : t.modal.add}</Button>
          <Button color="gray" onClick={() => setModalOpen(false)}>{t.modal.cancel}</Button>
        </ModalFooter>
      </Modal>
    </StudentLayout>
  );
}
