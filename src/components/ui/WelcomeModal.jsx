// src/components/ui/WelcomeModal.jsx
import { Modal, ModalBody, ModalHeader, Button } from "flowbite-react";
import { useAuth } from "../../contexts/AuthContext";
import translations from "../../translations";

export default function WelcomeModal({
  open = false,
  name = "",
  message = "",
  onConfirm,
  onClose,
}) {
  const { lang } = useAuth();
  const t = translations[lang]?.welcomeModal || translations.es.welcomeModal;

  // Función para reemplazar {name} en el texto
  const getWelcomeText = () => {
    if (name) {
      return t.welcomeName.replace("{name}", name);
    }
    return t.welcome;
  };

  return (
    <Modal show={open} size="md" popup onClose={onClose}>
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <img
              src="/LogoColorEMA2.svg"
              alt="Logo EMA"
              className="h-50 w-50 object-contain"
            />
          </div>
          <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            {getWelcomeText()}
          </h3>

          <div className="flex justify-center gap-3">
            <Button color="cyan" onClick={onConfirm}>
              {t.continue}
            </Button>
            <Button color="gray" onClick={onClose} outline>
              {t.cancel}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
