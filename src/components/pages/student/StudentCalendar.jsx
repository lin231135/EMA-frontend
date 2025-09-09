// src/pages/student/StudentCalendar.jsx
import StudentLayout from "../../layout/student/StudentLayout";
import { useState } from "react";

export default function StudentCalendar() {
  const [view, setView] = useState("month");

  return (
    <StudentLayout>
      <div className="w-full">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Calendar
          </h1>
          <button className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
            + Add New Class
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Panel lateral izquierdo */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Clases de Hoy
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  🎹
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Piano Class</p>
                  <p className="text-sm text-gray-500">Hoy 11:00 AM</p>
                  <p className="text-xs text-gray-400">56 Davion Mission Suite 157</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                  🎤
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Sing Class</p>
                  <p className="text-sm text-gray-500">Hoy 1:00 PM</p>
                  <p className="text-xs text-gray-400">853 Moore Flats Suite 15B</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendario principal */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            {/* Header del calendario */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200">
                  &lt;
                </button>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  July 2025
                </h2>
                <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200">
                  &gt;
                </button>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => setView("day")}
                  className={`px-3 py-1 rounded-md ${
                    view === "day"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setView("week")}
                  className={`px-3 py-1 rounded-md ${
                    view === "week"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView("month")}
                  className={`px-3 py-1 rounded-md ${
                    view === "month"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Month
                </button>
              </div>
            </div>

            {/* Grid calendario (simplificado) */}
            <div className="grid grid-cols-7 gap-2 text-center text-gray-600 dark:text-gray-300 text-sm">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="font-semibold">
                  {d}
                </div>
              ))}
              {/* Días de ejemplo */}
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="border h-24 rounded-lg relative text-xs flex items-start justify-end p-1"
                >
                  <span>{i + 1 <= 31 ? i + 1 : ""}</span>

                  {/* Ejemplo: Clase en el día 5 */}
                  {i + 1 === 5 && (
                    <div className="absolute top-6 left-1 right-1 bg-indigo-200 text-indigo-700 rounded px-1 py-0.5 text-[10px]">
                      Piano Class
                    </div>
                  )}

                  {i + 1 === 5 && (
                    <div className="absolute top-12 left-1 right-1 bg-pink-200 text-pink-700 rounded px-1 py-0.5 text-[10px]">
                      Sing Class
                    </div>
                  )}

                  {i + 1 === 26 && (
                    <div className="absolute top-6 left-1 right-1 bg-orange-200 text-orange-700 rounded px-1 py-0.5 text-[10px]">
                      Holiday
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
