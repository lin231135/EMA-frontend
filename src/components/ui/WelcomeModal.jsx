// src/components/ui/WelcomeModal.jsx
import { Modal, ModalBody, ModalHeader, Button } from "flowbite-react";

export default function WelcomeModal({
  open = false,
  name = "",
  message = "",
  onConfirm,
  onClose,
}) {
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
            {name ? `¡Bienvenido(a), ${name}!` : "¡Bienvenido(a)!"}
          </h3>

          <div className="flex justify-center gap-3">
            <Button color="cyan" onClick={onConfirm}>
              Continuar
            </Button>
            <Button color="gray" onClick={onClose} outline>
              Cancelar
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
