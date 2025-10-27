// src/components/forms/PaymentForm.jsx
import { useRef, useState, useEffect } from "react";
import { Button, Label, Textarea } from "flowbite-react";
import { useNavigate } from "react-router-dom";

import en from "../../translations/en/form/PaymentForm";
import es from "../../translations/es/form/PaymentForm";

import { useAuth } from "../../contexts/AuthContext";
import { getUsers, getChildrenByParentId } from "../../services/admin/adminUsersService";
import { uploadPaymentProof } from "../../services/app/uploadService";

const fmtDate = (iso) => {
  if (!iso) return "dd / mm / yyyy";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd} / ${mm} / ${yyyy}`; 
};

export default function PaymentForm({
  onSubmit,
  onCancel,
  contextRole = "admin",
  showHeader = true,
  initialValues = {},
  readOnlyFields = {},
  studentOptions = [],
  isLoading = false,
}) {
  const navigate = useNavigate();
  const { lang, user, token } = useAuth(); // Agregar token del contexto
  const t = (lang === "es" ? es : en) ?? en;

  const dateRef = useRef(null);
  const fileRef = useRef(null);

  const defaults = {
    studentName: "",
    studentId: "", // ID del estudiante (para admin)
    parentName: "",
    parentId: "", // Agregar parentId para el admin
    method: "transfer", // Valor por defecto: transferencia
    date: "",
    currency: t.form.currencySymbol ?? "Q",
    total: "",
    notes: "",
    proof: null,
  };

  const [form, setForm] = useState({ ...defaults, ...initialValues });
  
  // Estados para dropdowns del administrador
  const [parents, setParents] = useState([]);
  const [children, setChildren] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);
  
  // Estados para la subida de imágenes
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValues.proof || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Guardar archivo sin subir

  // Cargar padres cuando el componente es usado por el administrador
  useEffect(() => {
    console.log("PaymentForm - useEffect loadParents", { contextRole, user, token, hasToken: !!token });
    if (contextRole === "admin" && token) {
      loadParents();
    }
  }, [contextRole, token]);

  // Cargar hijos cuando se selecciona un padre (solo para admin)
  useEffect(() => {
    console.log("PaymentForm - useEffect loadChildren", { 
      contextRole, 
      parentId: form.parentId, 
      hasToken: !!token 
    });
    
    if (contextRole === "admin" && form.parentId && token) {
      loadChildren(form.parentId);
    } else {
      setChildren([]);
      if (contextRole === "admin") {
        setForm(prev => ({ ...prev, studentName: "" }));
      }
    }
  }, [form.parentId, contextRole, token]);

  const loadParents = async () => {
    try {
      console.log("Cargando padres...", { token });
      setLoadingParents(true);
      const data = await getUsers({ token, role: "padre" });
      console.log("Padres cargados:", data);
      setParents(data);
    } catch (error) {
      console.error("Error al cargar padres:", error);
      alert("Error al cargar la lista de padres");
    } finally {
      setLoadingParents(false);
    }
  };

  const loadChildren = async (parentId) => {
    try {
      console.log("loadChildren - parentId:", parentId, "tipo:", typeof parentId);
      setLoadingChildren(true);
      const data = await getChildrenByParentId({ token, parentId });
      console.log("loadChildren - children recibidos:", data);
      setChildren(data);
    } catch (error) {
      console.error("Error al cargar hijos:", error);
      alert("Error al cargar la lista de hijos");
      setChildren([]);
    } finally {
      setLoadingChildren(false);
    }
  };

  useEffect(() => {
      // Actualizar formulario cuando cambien los valores iniciales
      if (Object.keys(initialValues).length > 0) {
        setForm((prev) => ({ ...prev, ...initialValues }));
      }
    }, [initialValues]);

    useEffect(() => {
    if (studentOptions.length === 0 || readOnlyFields.studentName) return;

    // Si el form trae label y no value, intenta mapearlo al value correcto.
    const current = form.studentName;
    const hit = studentOptions.find(
      (opt) => opt.value === current || opt.label === current
    );

    if (hit && current !== hit.value) {
      setForm((s) => ({ ...s, studentName: hit.value }));
    }
    // Si no hay match, deja "" para que el usuario elija.
  }, [studentOptions, readOnlyFields.studentName, form.studentName]);


  const handleChange = async (e) => {
    const { name, value, files, type } = e.target;
    
    // Si el admin cambia el padre, actualizar parentId y parentName
    if (name === "parentId" && contextRole === "admin") {
      const selectedParent = parents.find(p => p.id === parseInt(value));
      setForm((s) => ({
        ...s,
        parentId: value,
        parentName: selectedParent ? `${selectedParent.name} ${selectedParent.last_name}` : "",
        studentName: "", // Resetear estudiante cuando cambia el padre
        studentId: "", // Resetear también el ID
      }));
      return;
    }
    
    // Si el admin cambia el estudiante, actualizar el nombre y el ID
    if (name === "studentId" && contextRole === "admin") {
      const selectedChild = children.find(c => c.id === parseInt(value));
      setForm((s) => ({
        ...s,
        studentId: value,
        studentName: selectedChild ? selectedChild.name : "",
      }));
      return;
    }
    
    // Si es un archivo (comprobante de pago), solo guardarlo localmente
    if (type === "file" && files && files[0]) {
      const file = files[0];
      
      // Guardar el archivo para subirlo después
      setSelectedFile(file);
      
      // Crear preview local solo para imágenes (no para PDFs)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // Para PDFs, mostrar que hay un archivo seleccionado
        setImagePreview(null);
      }
      
      setForm((s) => ({
        ...s,
        proof: file.name, // Guardar solo el nombre temporalmente
      }));
      return;
    }
    
    setForm((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!form.studentName?.trim()) {
      alert(t.alerts?.required || "Por favor completa el nombre del estudiante");
      return;
    }
    
    if (!form.date) {
      alert(t.alerts?.dateRequired || "Por favor selecciona una fecha");
      return;
    }
    
    const amount = parseFloat(form.total);
    if (!form.total || isNaN(amount) || amount <= 0) {
      alert(t.alerts?.invalidAmount || "Por favor ingresa un monto válido mayor a 0");
      return;
    }
    
    // Si hay un archivo seleccionado, subirlo primero
    let proofUrl = form.proof;
    if (selectedFile) {
      try {
        setUploadingImage(true);
        const result = await uploadPaymentProof(selectedFile, token);
        proofUrl = result.url;
        setImageUrl(result.url);
        console.log("Archivo subido exitosamente:", result);
      } catch (error) {
        console.error("Error al subir archivo:", error);
        alert("Error al subir el comprobante: " + error.message);
        setUploadingImage(false);
        return; // No continuar si falla la subida
      } finally {
        setUploadingImage(false);
      }
    }
    
    // Determinar el estado del pago según el rol y el método de pago
    let paymentState;
    if (contextRole === "admin") {
      // Si el admin registra un pago en efectivo, se acepta automáticamente
      paymentState = form.method === "efectivo" ? "aceptado" : "en revision";
    } else {
      // Si un padre registra un pago, siempre va a revisión
      paymentState = "en revision";
    }
    
    const payload = { 
      ...form, 
      proof: proofUrl, // Usar la URL de ImageKit
      state: paymentState, // Usar 'state' en lugar de 'status'
      contextRole, 
      userId: user?.id 
    };
    onSubmit ? onSubmit(payload) : console.log("[PaymentForm] payload:", payload);
  };

  const handleCancel = () => {
    // Limpiar archivo seleccionado si el usuario cancela
    setSelectedFile(null);
    setImagePreview(null);
    
    if (onCancel) onCancel();
    else navigate(-1);
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="px-6 pt-4 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            <span className="text-gray-900 dark:text-gray-100">
              {t.header.breadcrumb}{" "}
            </span>
            {t.header.title}
          </h1>

          <Button
            onClick={() => navigate(-1)}
            className="shrink-0 flex items-center gap-2 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-300"
            pill
          >
            <svg
              className="w-6 h-6 text-white"
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
                d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"
              />
            </svg>
            {t.header.back}
          </Button>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 min-h-[550px]">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Parent name - Dropdown para admin */}
            <div>
              <label
                htmlFor="parentName"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.parentName}
              </label>
              
              {contextRole === "admin" && !readOnlyFields.parentName ? (
                // Dropdown de padres para admin
                <select
                  id="parentId"
                  name="parentId"
                  value={form.parentId}
                  onChange={handleChange}
                  required
                  disabled={loadingParents}
                  className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2.5 
                    text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                    dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500
                    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingParents ? "Cargando..." : (t.form.parentName_ph || "Selecciona un padre")}
                  </option>
                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name} {parent.last_name} - {parent.email}
                    </option>
                  ))}
                </select>
              ) : (
                // Input texto para padre (no admin o readonly)
                <input
                  id="parentName"
                  name="parentName"
                  type="text"
                  placeholder={t.form.parentName_ph}
                  value={form.parentName}
                  onChange={handleChange}
                  required
                  readOnly={!!readOnlyFields.parentName}
                  disabled={readOnlyFields.parentName}
                  className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 p-2.5 
                    text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                    dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500
                    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              )}
            </div>

            {/* Student name - Dropdown para admin basado en padre seleccionado */}
            <div>
              <label
                htmlFor="studentName"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.studentName}
              </label>
              
              {contextRole === "admin" && !readOnlyFields.studentName ? (
                // Dropdown de hijos para admin (depende de padre seleccionado)
                <select
                  id="studentId"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                  disabled={!form.parentId || loadingChildren}
                  className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2.5 
                    text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                    dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500
                    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!form.parentId 
                      ? "Primero selecciona un padre" 
                      : loadingChildren 
                      ? "Cargando hijos..." 
                      : (t.form.studentName_ph || "Selecciona un estudiante")
                    }
                  </option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              ) : studentOptions.length > 0 && !readOnlyFields.studentName ? (
                // Select cuando hay opciones disponibles (padre)
                <select
                  id="studentName"
                  name="studentName"
                  value={form.studentName}
                  onChange={handleChange}
                  required
                  className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2.5 
                    text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                    dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                >
                  <option value="">{t.form.studentName_ph || "Selecciona un estudiante"}</option>
                  {studentOptions.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                // Input texto cuando no hay opciones o es readonly
                <input
                  id="studentName"
                  name="studentName"
                  type="text"
                  placeholder={t.form.studentName_ph}
                  value={form.studentName}
                  onChange={handleChange}
                  required
                  readOnly={!!readOnlyFields.studentName}
                  className="block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2.5 
                    text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white 
                    dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500
                    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  disabled={readOnlyFields.studentName}
                />
              )}
            </div>

            {/* Payment method */}
            <div>
              <label
                htmlFor="paymentMethod"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.method}
              </label>
              <div className="relative w-full max-w-xs">
                <select
                  id="paymentMethod"
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full max-w-xs appearance-none rounded-lg bg-cyan-500 px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="cash">{t.methodOptions?.cash || "Efectivo"}</option>
                  <option value="transfer">{t.methodOptions?.transfer || "Transferencia"}</option>
                  <option value="deposit">{t.methodOptions?.deposit || "Depósito"}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Payment Date */}
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.date}
              </label>
              <input
                id="date"
                ref={dateRef}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="hidden"
              />
              
              <button
                type="button"
                aria-label="Seleccionar fecha de pago"
                onClick={() =>
                  dateRef.current?.showPicker?.() || dateRef.current?.click()
                }
                disabled={isLoading}
                className="flex w-full max-w-xs items-center justify-between rounded-lg bg-cyan-500 px-4 py-3 text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{fmtDate(form.date)}</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Total Payment */}
            <div>
              <label
                htmlFor="total"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.total}
              </label>
              <div className="flex items-stretch max-w-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
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
                      d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
                    />
                  </svg>
                </div>
                <input
                  id="total"
                  name="total"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder={t.form.total_ph || "0.00"}
                  value={form.total}
                  onChange={handleChange}
                  readOnly={!!readOnlyFields.total}
                  disabled={readOnlyFields.total || isLoading}
                  className="h-12 flex-1 rounded-r-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Proof of Payment */}
            <div>
              <label 
              htmlFor="proof"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.proof}
              </label>
              <input
                id="proof"
                ref={fileRef}
                type="file"
                name="proof"
                accept="image/*,.jpg,.jpeg,.png,.pdf,application/pdf"
                onChange={handleChange}
                disabled={isLoading || uploadingImage}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={isLoading || uploadingImage}
                className="w-full max-w-xs rounded-lg bg-cyan-500 px-4 py-3 text-sm font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage 
                  ? "Subiendo archivo..." 
                  : (t.form.proof_btn || "Subir comprobante (JPG, PNG, PDF)")}
              </button>
              
              {/* Preview del archivo */}
              {(imagePreview || selectedFile || imageUrl) && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile ? "Archivo seleccionado (se subirá al confirmar):" : "Vista previa:"}
                  </p>
                  {selectedFile && selectedFile.type === 'application/pdf' ? (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-4">
                      <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">PDF • {(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  ) : imagePreview ? (
                    <div>
                      <img 
                        src={imagePreview} 
                        alt="Comprobante de pago"
                        className="max-w-xs rounded-lg border border-gray-300 shadow-sm"
                      />
                      {selectedFile && (
                        <p className="mt-2 text-xs text-gray-500">
                          {selectedFile.name} • {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      )}
                    </div>
                  ) : (form.proof && form.proof.endsWith('.pdf')) ? (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-4">
                      <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Archivo PDF</p>
                        <a 
                          href={imageUrl || form.proof} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-600 hover:underline"
                        >
                          Ver documento
                        </a>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={imagePreview || imageUrl} 
                      alt="Comprobante de pago"
                      className="max-w-xs rounded-lg border border-gray-300 shadow-sm"
                    />
                  )}
                  {imageUrl && !selectedFile && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                      ✓ Archivo subido correctamente
                    </p>
                  )}
                  {selectedFile && !imageUrl && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                      ⚠ El archivo se subirá al confirmar el pago
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label
                htmlFor="notes"
                className="mb-2 block text-xl font-medium text-gray-900 dark:text-white"
              >
                {t.form.notes}
              </label>
              <Textarea
                id="notes"
                name="notes"
                placeholder={t.form.notes_ph || "Notas adicionales (opcional)"}
                rows={4}
                value={form.notes}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full max-w-md rounded-lg border-gray-300 focus:border-gray-500 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              color="failure"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto min-w-[200px] bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              type="button"
            >
              {t.actions?.cancel || "Cancelar"}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploadingImage}
              className="w-full sm:w-auto min-w-[200px] bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {(isLoading || uploadingImage) && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {uploadingImage
                ? "Subiendo comprobante..." 
                : isLoading 
                  ? (t.actions?.submitting || "Procesando...") 
                  : (t.actions?.submit || "Enviar Pago")
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
