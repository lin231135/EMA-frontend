import { useMemo, useState, Fragment } from "react";
import { Button, Badge, Modal, Tabs } from "flowbite-react";
import { PageLayout } from "../layout";
import translations from "../../translations";
import HeroCarousel from "../ui/HeroCarousel";
import PreRegisterForm from "../forms/PreRegisterForm";

// Utilidades de fechas
const startOfWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay(); // 0 dom
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // lunes
  return new Date(date.setDate(diff));
};
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const HOURS = Array.from({ length: 13 }, (_, i) => 8 + i);
const formatHour = (h) => `${String(h).padStart(2, "0")}:00`;
const fmtDate = (d) => d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
const ymd = (d) => d.toISOString().slice(0, 10);

// Demo ocupados 
const demoReserved = {};

export default function Schedule() {
  const [lang, setLang] = useState("en");
  const t = translations[lang].schedule;

  // Semana visible
  const [anchorDate, setAnchorDate] = useState(() => startOfWeek(new Date()));
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(anchorDate, i)), [anchorDate]);

  // Estado para mostrar/ocultar formulario 
  const [showForm, setShowForm] = useState(false);

  // Selección
  const [selected, setSelected] = useState([]); // [{date:'YYYY-MM-DD', hour:8}, ...]
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleSlot = (dateStr, hour) => {
    const key = `${dateStr}T${hour}`;
    setSelected((prev) =>
      prev.some((s) => `${s.date}T${s.hour}` === key)
        ? prev.filter((s) => `${s.date}T${s.hour}` !== key)
        : [...prev, { date: dateStr, hour }]
    );
  };
  const isSelected = (dateStr, hour) => selected.some((s) => s.date === dateStr && s.hour === hour);
  const isReserved = (dateStr, hour) => (demoReserved[dateStr] && demoReserved[dateStr].has(hour)) || false;

  const goPrevWeek = () => setAnchorDate((d) => addDays(d, -7));
  const goNextWeek = () => setAnchorDate((d) => addDays(d, 7));
  const goToday = () => setAnchorDate(startOfWeek(new Date()));

  // Handler de envío del PreRegisterForm 
  const handlePreRegisterSubmit = (formData) => {

    alert("¡Formulario enviado!");
    setShowForm(false); // regresar a la vista de calendario
  };

  return (
    <PageLayout lang={lang} setLang={setLang} t={t}>
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* === Hero Carousel === */}
        <section className="px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="max-w-7xl mx-auto">
            <HeroCarousel
              slides={t.homeCarousel?.slides || []}
              ctaPrimary={t.homeCarousel?.ctaPrimary}
              ctaSecondary={t.homeCarousel?.ctaSecondary}
              onPrimary={() => console.log("Go to Courses")}
              onSecondary={() => console.log("Go to Exams")}
            />
          </div>
        </section>

        {/* Título centrado */}
        <header className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-black">
            {t.preregisterTitle}
          </h1>
        </header>

        {/* Cambio */}
        {!showForm ? (
          <>
            <Tabs aria-label="Views" className="mb-4">
              <Tabs.Item active title={t.week} />
              <Tabs.Item title={t.monthSoon} />
            </Tabs>

            {/* Leyenda + Botonera */}
            <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
              {/* izquierda */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded bg-gray-200" /> {t.legendAvailable}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded bg-blue-500/70" /> {t.legendSelected}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded bg-red-300" /> {t.legendReserved}
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button color="light" onClick={goToday}>{t.today}</Button>
                <Button color="light" onClick={goPrevWeek}>←</Button>
                <Button color="light" onClick={goNextWeek}>→</Button>
              </div>
            </div>

            {/* Grid semanal */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="min-w-[720px] grid" style={{ gridTemplateColumns: "100px repeat(7, 1fr)" }}>
                {/* Header días */}
                <div className="bg-gray-50 dark:bg-gray-800 p-3 font-medium">Time</div>
                {days.map((d, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800 p-3 text-center font-medium" title={d.toDateString()}>
                    {fmtDate(d)}
                  </div>
                ))}
                {/* Filas de horas */}
                {HOURS.map((h) => (
                  <Fragment key={`row-${h}`}>
                    <div className="p-2 text-sm bg-white dark:bg-gray-900 border-t">
                      {formatHour(h)}
                    </div>
                    {days.map((d, j) => {
                      const dateStr = ymd(d);
                      const reserved = isReserved(dateStr, h);
                      const selectedNow = isSelected(dateStr, h);

                      let cellClass = "border-t p-1 sm:p-2 text-center cursor-pointer transition-colors";
                      if (reserved) cellClass += " bg-red-300 cursor-not-allowed";
                      else if (selectedNow) cellClass += " bg-blue-500/70 text-white";
                      else cellClass += " bg-gray-100 hover:bg-gray-200";

                      return (
                        <button
                          key={`c-${h}-${j}`}
                          className={cellClass}
                          onClick={() => !reserved && toggleSlot(dateStr, h)}
                          aria-pressed={selectedNow}
                        >
                          <span className="hidden sm:inline">
                            {selectedNow ? t.legendSelected : reserved ? t.legendReserved : t.legendAvailable}
                          </span>
                        </button>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Botón continuar */}
            <div className="flex justify-end mt-4">
              <Button color="blue" onClick={() => setShowForm(true)} disabled={!selected.length}>
                {t.continue}
              </Button>
            </div>

            {/* Your selection — solo cuando NO está el form */}
            <div className="mt-5">
              <h2 className="text-lg font-semibold mb-2">{t.yourSelection}</h2>
              {selected.length === 0 ? (
                <p className="text-gray-500">{t.pickAtLeastOne}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selected
                    .slice()
                    .sort((a, b) => (a.date + a.hour).localeCompare(b.date + b.hour))
                    .map((s, i) => (
                      <Badge key={i} color="info">
                        {new Date(s.date).toLocaleDateString()} — {formatHour(s.hour)}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <PreRegisterForm
              t={t}
              selected={selected}
              onCancel={() => setShowForm(false)}
              onSubmit={handlePreRegisterSubmit}
            />
          </>
        )}

        {/* Confirmación  */}
        <Modal show={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <Modal.Header>{t.confirmPre}</Modal.Header>
          <Modal.Body>
            {selected.length === 0 ? (
              <p>{t.pickAtLeastOne}</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {selected.map((s, i) => (
                  <li key={i}>
                    {new Date(s.date).toLocaleDateString()} — {formatHour(s.hour)}
                  </li>
                ))}
              </ul>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setConfirmOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={() => alert("TODO: send to backend")}>{t.confirm}</Button>
          </Modal.Footer>
        </Modal>
      </main>
    </PageLayout>
  );
}