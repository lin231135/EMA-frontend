import { NavLink, Link } from "react-router-dom";
import { Logo } from "../Logo";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

/* ---- Paleta por hijo ---- */
const KID_STYLES = {
  daniel: { dot: "bg-violet-500", accent: "accent-violet-500" },
  david:  { dot: "bg-pink-500",   accent: "accent-pink-500" },
};

const linkCls = (isActive, collapsed) =>
  [
    "flex items-center rounded-lg text-sm font-medium transition",
    "px-2 py-2",
    isActive
      ? "bg-cyan-500 text-white shadow-sm"
      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
    collapsed ? "justify-center" : "justify-start",
  ].join(" ");

/* Generar items dinámicamente con traducciones */
const getItems = (t) => [
  { to: "/parent/ParentDashboard", label: t.dashboard, icon: "grid" },
  { to: "/parent/ParentCalendar",  label: t.calendar,  icon: "calendar" },
  // { to: "/parent/PaymentHistory", label: t.paymentHistory, icon: "card" },
  // { to: "/parent/Books",          label: t.books,           icon: "book" },
  // { to: "/parent/Account",        label: t.account,         icon: "user" },
];

function Icon({ name }) {
  const pathMap = {
    grid: "M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z",
    calendar:
      "M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z",
    card:
      "M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4Zm0 6h16v6H4v-6Z M5 14a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm5 0a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1Z",
    book:
      "M6 2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 1 0 0-2h-2v-2h2a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2h-8v16h5v2H7a1 1 0 1 1 0-2h1V2H6Z",
    user:
      "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z",
  };

  return (
    <svg className="w-5 h-5 text-gray-400 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
      <path d={pathMap[name]} clipRule="evenodd" />
    </svg>
  );
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  kidsFilter,
  onToggleKid,
  kidsLabels = { daniel: "Daniel Chet", david: "David Chet" },
}) {
  const { lang } = useAuth();
  const t = translations[lang]?.parentSidebar || translations.es.parentSidebar;
  const items = getItems(t);
  return (
    <aside
      className={[
        "hidden md:flex md:flex-col md:h-screen",
        "fixed top-0 left-0",
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
        "transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-20" : "w-64",
      ].join(" ")}
    >
      {/* Header */}
      <div className={`flex items-center px-0 py-3 ${collapsed ? "flex-col justify-center" : "flex-row justify-between"}`}>
        <Link to="/parent/ParentDashboard" className="flex items-center justify-start gap-3">
          <Logo size="h-10" variant="color" />
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold text-cyan-600">Ellie’s Music</div>
              <div className="text-xs text-gray-700 dark:text-gray-300 -mt-0.5">Academy</div>
            </div>
          )}
        </Link>

        <button
          onClick={onToggleCollapse}
          className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mt-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6l6 6-6 6" /></svg>
          ) : (
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M14 6l-6 6 6 6" /></svg>
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="px-3">
        <ul className="space-y-1 font-medium">
          {items.map((it) => (
            <li key={it.to}>
              <NavLink
                to={it.to}
                className={({ isActive }) => linkCls(isActive, collapsed)}
                title={collapsed ? it.label : undefined}
              >
                <span className="me-2 flex-shrink-0"><Icon name={it.icon} /></span>
                <span className={collapsed ? "hidden" : "ms-1 truncate"}>{it.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Filtros de hijos */}
      {!collapsed && kidsFilter && onToggleKid && (
        <div className="mt-4 mx-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Students</p>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-cyan-500"
                checked={kidsFilter.all}
                onChange={() => onToggleKid("all")}
              />
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-500" />
                All
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className={KID_STYLES.daniel.accent}
                checked={kidsFilter.daniel}
                onChange={() => onToggleKid("daniel")}
              />
              <span className="inline-flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${KID_STYLES.daniel.dot}`} />
                {kidsLabels.daniel}
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className={KID_STYLES.david.accent}
                checked={kidsFilter.david}
                onChange={() => onToggleKid("david")}
              />
              <span className="inline-flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${KID_STYLES.david.dot}`} />
                {kidsLabels.david}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto px-3 pb-4 space-y-1 border-t border-gray-200 dark:border-gray-800">
        <NavLink to="/settings" className={({ isActive }) => linkCls(isActive, collapsed)} title={collapsed ? "Settings" : undefined}>
          <span className="me-2 flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2 2 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414Z" />
            </svg>
          </span>
          <span className={collapsed ? "hidden" : "ms-1 truncate"}>Settings</span>
        </NavLink>

        <NavLink to="/logout" className={linkCls(false, collapsed)} title={collapsed ? "Logout" : undefined}>
          <span className="me-2 flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-400" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
            </svg>
          </span>
          <span className={collapsed ? "hidden" : "ms-1 truncate"}>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}