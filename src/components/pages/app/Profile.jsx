// src/components/pages/app/Profile.jsx
import { Card, Button, Avatar } from "flowbite-react";
import StudentLayout from "../../layout/student/StudentLayout";
import AdminLayout from "../../layout/admin/AdminLayout";
import ParentLayout from "../../layout/parent/ParentLayout";
import { useState, useEffect, Fragment } from "react";
import PersonalInfoModal from "../../ui/modalProfile/PersonalInfoModalProfile";
import AddressModalProfile from "../../ui/modalProfile/AddressModalProfile";
import ChildrenManagementSection from "../parent/ChildrenManagementSection";
import translations from "../../../translations";
import { useAuth } from "../../../contexts/AuthContext";
import { EditIcon } from "../../ui/Icons";

/* ---------- Small helper components ---------- */
function ReadonlyField({ label, value }) {
    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-gray-900 dark:text-gray-100">{value || "—"}</p>
        </div>
    );
}

function EditButton({ onClick, children }) {
    return (
        <Button
            size="sm"
            onClick={onClick}
            className="gap-2 text-white bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300"
        >
            <EditIcon className="w-4 h-4" />
            {children}
        </Button>
    );
}

function Section({ title, onEdit, editText, children }) {
    return (
        <Card className="shadow-sm border border-gray-200/80 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                {onEdit && <EditButton onClick={onEdit}>{editText}</EditButton>}
            </div>
            {children}
        </Card>
    );
}

/* ---------- Toast system (React-controlled) ---------- */
/* - toasts: array of { id, type: 'success'|'danger'|'warning', message }
   - se muestran en la esquina inferior derecha, auto-dismiss después de duration ms
   - close manual con botón
*/
function ToastStack({ toasts, onClose }) {
    return (
        // posicion fija: bottom-right
        <div aria-live="polite" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 z-50">
            <div className="w-full flex flex-col items-end space-y-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className="pointer-events-auto w-full max-w-xs p-4 mb-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg mr-3"
                                style={{
                                    backgroundColor:
                                        t.type === "success"
                                            ? undefined
                                            : t.type === "danger"
                                            ? undefined
                                            : undefined,
                                }}
                            >
                                {/* Simple icons (inline, small) - avoids complex SVG attribute differences */}
                                {t.type === "success" && (
                                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                    </svg>
                                )}
                                {t.type === "danger" && (
                                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                                    </svg>
                                )}
                                {t.type === "warning" && (
                                    <svg className="w-5 h-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex-1 text-sm font-normal">{t.message}</div>

                            <button
                                onClick={() => onClose(t.id)}
                                className="ms-3 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                aria-label="Close"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------- Main component ---------- */
export default function Profile() {
    const { lang, token, user: authUser, authFetch } = useAuth();
    const t = translations[lang].studentProfile;
    const API_BASE = String(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

    const [openPersonal, setOpenPersonal] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [user, setUser] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        addresses: [],
    });

    // Toasts: array controlled by state
    const [toasts, setToasts] = useState([]);
    const TOAST_DURATION = 4500; // ms (ajusta si quieres más/menos)

    const addToast = (type, message, duration = TOAST_DURATION) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        setToasts((s) => [...s, { id, type, message }]);
        // auto remove
        setTimeout(() => {
            setToasts((s) => s.filter((x) => x.id !== id));
        }, duration);
    };
    const removeToast = (id) => setToasts((s) => s.filter((x) => x.id !== id));

    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    const jsonHeaders = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeaders,
    };
    const withCreds = { credentials: "include" };

    // Cargar perfil del usuario (con múltiples direcciones)
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const url = `${API_BASE}/users/profile`;
                console.debug("GET", url);
                const res = await authFetch(url, { method: "GET" });
                if (!res.ok) throw new Error(`GET /users/profile ${res.status}`);
                const data = await res.json();

                setUser({
                    name: data.user?.name || "",
                    lastName: data.user?.last_name || "",
                    email: data.user?.email || "",
                    phone: data.user?.phone || "",
                    addresses: data.addresses || [],
                });
            } catch (err) {
                console.error("Error cargando perfil:", err);
                // notificar al usuario
                addToast("danger", "Error cargando perfil.");
            }
        };
        if (token) loadProfile();
    }, [API_BASE, token, authFetch]);

    // Actualizar info personal
    const handleUpdatePersonal = async (info) => {
        try {
            const body = {
                name: info.name ?? user.name,
                last_name: info.lastName ?? user.lastName,
                email: info.email ?? user.email,
                phone: info.phone ?? user.phone,
            };
            const url = `${API_BASE}/users/profile`;
            const res = await authFetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                // intenta parsear mensaje de error (si viene)
                let msg = `Error actualizando perfil (${res.status})`;
                try {
                    const errJson = await res.json();
                    if (errJson?.message) msg = errJson.message;
                } catch (e) {}
                throw new Error(msg);
            }
            const updated = await res.json();
            setUser((u) => ({
                ...u,
                name: updated.user?.name ?? u.name,
                lastName: updated.user?.last_name ?? u.lastName,
                email: updated.user?.email ?? u.email,
                phone: updated.user?.phone ?? u.phone,
            }));
            setOpenPersonal(false);

            // Notificaciones: toast y fallback alert
            addToast("success", "Perfil actualizado correctamente.");
        } catch (err) {
            console.error("Error actualizando perfil:", err);
            addToast("danger", err.message || "Error actualizando perfil.");
        }
    };

    // Abrir modal para editar la dirección principal (o la primera disponible)
    const openAddressEditor = () => {
        const primary = user.addresses.find((a) => a.is_primary) || user.addresses[0] || null;
        setSelectedAddress(primary);
        setOpenAddress(true);
    };

    const handleUpdateAddress = async (updated) => {
        try {
            if (!updated?.id) {
                setOpenAddress(false);
                setSelectedAddress(null);
                return;
            }
            const url = `${API_BASE}/users/profile/address/${updated.id}`;
            const res = await authFetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });
            if (!res.ok) {
                let msg = `Error actualizando dirección (${res.status})`;
                try {
                    const errJson = await res.json();
                    if (errJson?.message) msg = errJson.message;
                } catch (e) {}
                throw new Error(msg);
            }
            const data = await res.json();
            setUser((u) => ({
                ...u,
                addresses: u.addresses.map((a) => (a.id === data.address.id ? data.address : a)),
            }));
            setOpenAddress(false);
            setSelectedAddress(null);

            addToast("success", "Dirección actualizada correctamente.");
        } catch (err) {
            console.error("Error actualizando dirección:", err);
            addToast("danger", err.message || "Error actualizando dirección.");
        }
    };

    // Layout dinámico por rol (fallback a Fragment)
    const layoutsByRole = {
        admin: AdminLayout,
        padre: ParentLayout,
        estudiante: StudentLayout,
    };
    if (!authUser) return null;
    const LayoutComponent = layoutsByRole[authUser.role] || Fragment;

    // Dirección a mostrar (solo lectura)
    const addr = user.addresses.find((a) => a.is_primary) || user.addresses[0] || {};

    return (
        <LayoutComponent>
            <div className="w-full">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.title}</h1>

                    {/* Tarjeta superior */}
                    <Card className="mb-6 shadow-sm border border-gray-200/80 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            <Avatar img={user.avatar} rounded size="lg" />
                            <div className="text-center sm:text-left">
                                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {user.name} {user.lastName}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{authUser.role}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Información Personal */}
                    <Section title={t.sections.personal} editText={t.buttons.edit} onEdit={() => setOpenPersonal(true)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ReadonlyField label={t.fields.name} value={user.name} />
                            <ReadonlyField label={t.fields.lastName} value={user.lastName} />
                            <ReadonlyField label={t.fields.email} value={user.email} />
                            <ReadonlyField label={t.fields.phone} value={user.phone} />
                        </div>
                    </Section>

                    {/* Dirección (simple, sin tabla) */}
                    <div className="mt-6">
                        <Section
                            title={t.sections.address || t.sections.addresses}
                            editText={t.buttons.edit}
                            onEdit={openAddressEditor}
                        >
                            {user.addresses.length === 0 ? (
                                <p className="text-gray-500">No hay direcciones registradas.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <ReadonlyField label={t.fields.city} value={addr.city} />
                                    <ReadonlyField label={t.fields.apartment} value={addr.apartment || addr.apt} />
                                    <ReadonlyField label={t.fields.municipality} value={addr.municipality} />
                                    <ReadonlyField label={t.fields.street} value={addr.street_avenue} />
                                    <ReadonlyField label={t.fields.zone} value={addr.zone} />
                                    <ReadonlyField label={t.fields.house} value={addr.house_number} />
                                    <ReadonlyField label={t.fields.colony} value={addr.neighborhood} />
                                </div>
                            )}
                        </Section>
                    </div>

                    {/* Gestión de Hijos - Solo visible para padres */}
                    {authUser?.role === "padre" && (
                        <div className="mt-6">
                            <Card className="shadow-sm border border-gray-200/80 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Gestión de Perfiles de Hijos
                                </h3>
                                <ChildrenManagementSection addToast={addToast} />
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Modales */}
            <PersonalInfoModal
                open={openPersonal}
                onClose={() => setOpenPersonal(false)}
                user={user}
                onSubmit={handleUpdatePersonal}
            />
            <AddressModalProfile
                open={openAddress}
                onClose={() => {
                    setOpenAddress(false);
                    setSelectedAddress(null);
                }}
                address={selectedAddress}
                onSubmit={handleUpdateAddress}
            />

            {/* Toast stack */}
            <ToastStack toasts={toasts} onClose={removeToast} />
        </LayoutComponent>
    );
}
