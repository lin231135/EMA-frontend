export default {
  title: "Mi Perfil",

  sections: {
    personal: "Información Personal",
    address: "Dirección",
  },

  fields: {
    name: "Nombre",
    lastName: "Apellido",
    email: "Correo electrónico",
    phone: "Número de teléfono",
    city: "Ciudad",
    apartment: "Apartamento",
    municipality: "Municipio",
    street: "Calle / Avenida",
    zone: "Zona",
    house: "No. Casa",
    colony: "Colonia",
  },

  buttons: {
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
  },

  modals: {
    personalTitle: "Editar Información Personal",
    addressTitle: "Editar Dirección",
  },

  changePhoto: "Cambiar foto",
  deletePhoto: "Eliminar foto",
  uploadPhoto: "Subir foto",
  maxSize: "Máx. 5MB (JPG, PNG, WEBP, GIF)",
  confirmDelete: "¿Estás seguro de que deseas eliminar tu foto de perfil?",
  invalidType: "Tipo de archivo no válido. Solo se permiten imágenes JPG, PNG, WEBP o GIF.",
  tooLarge: "El archivo es demasiado grande. Tamaño máximo: 5MB",
};