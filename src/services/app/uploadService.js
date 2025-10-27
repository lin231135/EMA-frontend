// src/services/uploadService.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Sube una imagen de comprobante de pago a ImageKit
 * @param {File} file - Archivo de imagen a subir
 * @param {string} token - Token de autenticación
 * @returns {Promise<{url: string, fileId: string, thumbnail: string}>}
 */
export async function uploadPaymentProof(file, token) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload/payment-proof`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al subir la imagen');
    }

    const data = await response.json();
    return data.data; // { url, fileId, thumbnail }
  } catch (error) {
    console.error('Error en uploadPaymentProof:', error);
    throw error;
  }
}
