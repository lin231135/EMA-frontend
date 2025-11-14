// src/components/forms/ParentMultiPaymentForm.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Label, Textarea } from "flowbite-react";
import { useAuth } from "../../contexts/AuthContext";
import { getUnpaidBookingsByParent } from "../../services/admin/adminBookingsService";
import { uploadPaymentProof } from "../../services/app/uploadService";

import es from "../../translations/es/form/ParentMultiPaymentForm";
import en from "../../translations/en/form/ParentMultiPaymentForm";

export default function ParentMultiPaymentForm({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  bookingsService = null // Servicio personalizado para cargar bookings
}) {
  const navigate = useNavigate();
  const { lang, token, user } = useAuth();
  const t = (lang === "es" ? es : en) ?? en;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    method: "transferencia", // Solo transferencia o depósito para padres
    date: new Date().toISOString().split('T')[0],
    notes: "",
  });

  const [students, setStudents] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState(new Set());
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  // Estados para upload de imagen
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Cargar bookings del padre al iniciar
  useEffect(() => {
    if (token && user?.id) {
      loadBookings(user.id);
    }
  }, [token, user?.id]);

  const loadBookings = async (parentId) => {
    try {
      setLoadingBookings(true);
      
      // Usar servicio personalizado si se provee (ej: para estudiantes), sino usar el de padres
      const data = bookingsService 
        ? await bookingsService(token)
        : await getUnpaidBookingsByParent(parentId, token);
      
      setStudents(data.students || []);
      setSelectedBookings(new Set());
    } catch (error) {
      console.error("Error al cargar bookings:", error);
      alert(t.alerts.load_classes_error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleBookingToggle = (bookingId) => {
    setSelectedBookings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const handleStudentToggleAll = (student) => {
    const studentBookingIds = student.bookings.map(b => b.booking_id);
    const allSelected = studentBookingIds.every(id => selectedBookings.has(id));
    
    setSelectedBookings(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        studentBookingIds.forEach(id => newSet.delete(id));
      } else {
        studentBookingIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Preview solo para imágenes
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    students.forEach(student => {
      student.bookings.forEach(booking => {
        if (selectedBookings.has(booking.booking_id)) {
          total += booking.cost;
        }
      });
    });
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (selectedBookings.size === 0) {
      alert(t.alerts.select_classes);
      return;
    }

    if (!form.date) {
      alert(t.alerts.select_date);
      return;
    }

    // Padres/Estudiantes DEBEN subir comprobante
    if (!selectedFile) {
      alert(t.alerts.proof_required);
      return;
    }

    // Subir comprobante (obligatorio para padres/estudiantes)
    let proofUrl = null;
    try {
      setUploadingImage(true);
      const result = await uploadPaymentProof(selectedFile, token);
      proofUrl = result.url;
      setImageUrl(result.url);
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      alert(t.alerts.upload_error + " " + error.message);
      setUploadingImage(false);
      return;
    } finally {
      setUploadingImage(false);
    }

    // Extraer payment_ids de los bookings seleccionados
    const paymentIds = [];
    students.forEach(student => {
      student.bookings.forEach(booking => {
        if (selectedBookings.has(booking.booking_id) && booking.payment_id) {
          paymentIds.push(booking.payment_id);
        }
      });
    });

    // Preparar payload
    const payload = {
      user_id: user.id,
      payment_method: form.method,
      total: calculateTotal(),
      payment_date: form.date,
      state: "en revision", // Siempre en revisión cuando se sube comprobante
      reference_pic: proofUrl,
      note: form.notes || null,
      booking_ids: Array.from(selectedBookings),
      payment_ids: paymentIds // IDs de los pagos existentes a actualizar
    };

    onSubmit(payload);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImagePreview(null);
    onCancel ? onCancel() : navigate(-1);
  };

  const total = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.header.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t.header.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card: Lista de Estudiantes y sus Clases */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.form.classes_title}
            </h2>
            {students.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {students.length} {students.length === 1 ? t.form.student_count_one : t.form.student_count_many}
              </span>
            )}
          </div>

          {loadingBookings ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">{t.form.loading_classes}</span>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">{t.form.no_classes}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t.form.no_classes_subtitle}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map(student => (
                <div key={student.kid_id} className="border rounded-lg p-4 bg-white dark:bg-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {student.student_name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleStudentToggleAll(student)}
                      className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      {student.bookings.every(b => selectedBookings.has(b.booking_id))
                        ? t.form.deselect_all
                        : t.form.select_all}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {student.bookings.map(booking => (
                      <label
                        key={booking.booking_id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-600 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBookings.has(booking.booking_id)}
                          onChange={() => handleBookingToggle(booking.booking_id)}
                          className="w-5 h-5 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.course_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.schedule_date && new Date(booking.schedule_date).toLocaleDateString()} 
                            {booking.start_time && ` - ${booking.start_time.slice(0, 5)}`}
                            {booking.modality && ` • ${booking.modality}`}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          Q{booking.cost.toFixed(2)}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Card: Total */}
        {selectedBookings.size > 0 && (
          <Card>
            <div className="bg-cyan-50 dark:bg-cyan-900 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {t.form.total_label} ({selectedBookings.size} {selectedBookings.size === 1 ? t.form.class_one : t.form.class_many}):
                </span>
                <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  Q{total.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Card: Método de Pago y Fecha */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="method" value={`${t.form.method} *`} className="mb-2" />
              <select
                id="method"
                value={form.method}
                onChange={(e) => setForm(prev => ({ ...prev, method: e.target.value }))}
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
              >
                <option value="transferencia">{t.methodOptions.transfer}</option>
                <option value="deposito">{t.methodOptions.deposit}</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t.form.method_info}
              </p>
            </div>

            <div>
              <Label htmlFor="date" value={`${t.form.date} *`} className="mb-2" />
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
              />
            </div>
          </div>
        </Card>

        {/* Card: Comprobante (OBLIGATORIO para padres) */}
        <Card>
          <div>
            <Label htmlFor="proof" value={`${t.form.proof} *`} className="mb-2" />
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
              {t.form.proof_required_notice}
            </p>
            <input
              ref={fileRef}
              id="proof"
              type="file"
              accept="image/*,.jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              disabled={isLoading || uploadingImage}
              className="hidden"
              required
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isLoading || uploadingImage}
              className="w-full max-w-xs rounded-lg bg-cyan-500 px-4 py-3 text-sm font-medium text-white hover:bg-cyan-600 disabled:opacity-50"
            >
              {uploadingImage ? t.form.uploading : t.form.proof_btn}
            </button>

            {(imagePreview || selectedFile) && (
              <div className="mt-4">
                {selectedFile?.type === 'application/pdf' ? (
                  <div className="flex items-center gap-2 p-4 border rounded-lg">
                    <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                    </svg>
                    <span>{selectedFile.name}</span>
                  </div>
                ) : imagePreview && (
                  <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg border" />
                )}
                {selectedFile && (
                  <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                    ✓ {t.form.file_selected}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Card: Notas */}
        <Card>
          <div>
            <Label htmlFor="notes" value={t.form.notes} className="mb-2" />
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder={t.form.notes_placeholder}
            />
          </div>
        </Card>

        {/* Aviso importante */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ℹ️ {t.form.review_notice}
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isLoading || uploadingImage}
            color="gray"
          >
            {t.actions.cancel}
          </Button>
          <Button
            type="submit"
            disabled={isLoading || uploadingImage || selectedBookings.size === 0 || !selectedFile}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {uploadingImage ? t.actions.uploading_proof : isLoading ? t.actions.processing : t.actions.submit}
          </Button>
        </div>
      </form>
    </div>
  );
}
