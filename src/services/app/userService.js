// src/services/app/userService.js

/**
 * Servicio para gestionar operaciones de usuario y perfil
 * Trabaja en conjunto con authFetch del contexto de autenticación
 */
class UserService {
  /**
   * Convierte un archivo a base64
   * @param {File} file - Archivo a convertir
   * @returns {Promise<string>} - String base64
   */
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Valida que el archivo sea una imagen válida
   * @param {File} file - Archivo a validar
   * @param {number} maxSizeMB - Tamaño máximo en MB (default: 5)
   * @throws {Error} Si el archivo no es válido
   */
  static validateImageFile(file, maxSizeMB = 5) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      throw new Error("Tipo de archivo no válido. Solo se permiten imágenes JPG, PNG, WEBP o GIF.");
    }

    if (file.size > maxSizeBytes) {
      throw new Error(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
    }

    return true;
  }

  /**
   * Prepara y valida un archivo de imagen para subir
   * @param {File} file - Archivo a preparar
   * @returns {Promise<string>} - Imagen en formato base64
   */
  static async prepareImageForUpload(file) {
    // Validar archivo
    this.validateImageFile(file);
    
    // Convertir a base64
    const base64 = await this.fileToBase64(file);
    
    return base64;
  }
}

export default UserService;