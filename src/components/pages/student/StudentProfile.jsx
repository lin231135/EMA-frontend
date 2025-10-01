// src/components/pages/student/StudentProfile.jsx
import { Card, Button, Avatar } from "flowbite-react";
import StudentLayout from "../../layout/student/StudentLayout";
import { useState } from "react";
import PersonalInfoModal from "../../ui/student/PersonalInfoModalProfile";
import AddressModalProfile from "../../ui/student/AddressModalProfile";
import translations from "../../../translations";
import { useAuth } from "../../../contexts/AuthContext";


function ReadonlyField({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-gray-900 dark:text-gray-100">{value || "—"}</p>
    </div>
  );
}

/**
 * Botón con ícono de lápiz 
 */
function EditButton({ onClick, children }) {
  return (
    <Button size="sm" onClick={onClick} className="gap-2 text-white bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300">
      <svg
        className="w-4 h-4 "
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.017 2.017 0 0 1 2.747 0Z"
        />
      </svg>
      {children}
    </Button>
  );
}

/**
 * Contenedor de sección 
 */
function Section({ title, onEdit, editText, children }) {
  return (
    <Card className="shadow-sm border border-gray-200/80 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <EditButton onClick={onEdit}>{editText}</EditButton>
      </div>

      {children}
    </Card>
  );
}

export default function StudentProfile() {
  const { lang } = useAuth();
  const t = translations[lang].studentProfile;
  const [user, setUser] = useState({
    name: "Daniel",
    lastName: "Chet",
    role: "Estudiante",
    email: "daniel@gmail.com",
    phone: "+502 12423946",
    avatar: "",
    address: {
      city: "Guatemala",
      apt: "----",
      municipality: "Guatemala, Mixco",
      street: "4.ta",
      zone: "9",
      house: "0-54",
      colony: "Santa Marta",
    },
  });

  const [openPersonal, setOpenPersonal] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);


  const handleUpdatePersonal = ({ email, phone }) => {
    setUser((u) => ({ ...u, email, phone }));
    setOpenPersonal(false);
  };

  const handleUpdateAddress = ({ address }) => {
  setUser((u) => ({ ...u, address: { ...u.address, ...address } }));
  setOpenAddress(false);
};

  return (
    <StudentLayout>
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h1>

          {/* Tarjeta superior */}
          <Card className="mb-6 shadow-sm border border-gray-200/80 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Avatar
                img={user.avatar}
                rounded
                size="lg"
              />
              <div className="text-center sm:text-left">
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {user.name} {user.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.role}
                </p>
              </div>
            </div>
          </Card>

          {/* Información Personal */}
          <Section
            title={t.sections.personal}
            editText={t.buttons.edit}
            onEdit={() => setOpenPersonal(true)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ReadonlyField label={t.fields.name} value={user.name} />
              <ReadonlyField label={t.fields.lastName} value={user.lastName} />
              <ReadonlyField label={t.fields.email} value={user.email} />
              <ReadonlyField label={t.fields.phone} value={user.phone} />
            </div>
          </Section>

          {/* Dirección */}
          <div className="mt-6">
            <Section
              title={t.sections.address}
              editText={t.buttons.edit}
              onEdit={() => setOpenAddress(true)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <ReadonlyField label={t.fields.city} value={user.address.city} />
                <ReadonlyField label={t.fields.apartment} value={user.address.apt} />
                <ReadonlyField
                  label={t.fields.municipality}
                  value={user.address.municipality}
                />
                <ReadonlyField label={t.fields.street} value={user.address.street} />
                <ReadonlyField label={t.fields.zone} value={user.address.zone} />
                <ReadonlyField label={t.fields.house} value={user.address.house} />
                <ReadonlyField label={t.fields.colony} value={user.address.colony} />
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* MODAL Información Personal */}
      <PersonalInfoModal
        open={openPersonal}
        onClose={() => setOpenPersonal(false)}
        user={user}
        onSubmit={handleUpdatePersonal}
      />
      {/* MODAL Direccion */}
      <AddressModalProfile
        open={openAddress}
        onClose={() => setOpenAddress(false)}
        user={user}
        onSubmit={handleUpdateAddress}
      />
    </StudentLayout>
    
  );
}
