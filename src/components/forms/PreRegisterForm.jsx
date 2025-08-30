import React, { useState } from "react";
import { Button, Card, Checkbox, Label, Select, TextInput } from "flowbite-react";

export default function PreRegisterForm({
  t = {},
  selected = [],
  onCancel,
  onSubmit,
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    preferredFormat: "",
    preferredLanguage: "",
    address: "", 
    childEnabled: true,
    childFullName: "",
    childDob: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      ...form,
      selected,
    });
  };

  const label = (k, fallback) => t?.[k] || fallback;

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
      <Card className="bg-white dark:bg-gray-900">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
          {label("registrationTitle", "Registration for enrolment")}
        </h1>

        <form onSubmit={handleSubmit} className="mt-2 space-y-6">
          {/* Full name */}
          <div>
            <Label htmlFor="fullName" className="mb-2 block">
              {label("fullName", "Full name")}
            </Label>
            <TextInput
              id="fullName"
              name="fullName"
              placeholder={label("fullName", "Full name")}
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-2 block">
              {label("email", "Email")}
            </Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder={label("email", "Email")}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone + Date of birth */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="phone" className="mb-2 block">
                {label("phone", "Phone number")}
              </Label>
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                placeholder={label("phone", "Phone number")}
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="dob" className="mb-2 block">
                {label("dob", "Date of birth")}
              </Label>
              <TextInput
                id="dob"
                name="dob"
                type="date"
                placeholder={label("dob", "Date of birth")}
                value={form.dob}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Preferred format + Preferred language */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="preferredFormat" className="mb-2 block">
                {label("preferredFormat", "Preferred format")}
              </Label>
              <Select
                id="preferredFormat"
                name="preferredFormat"
                value={form.preferredFormat}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {label("selectOption", "Select an option")}
                </option>
                <option value="in_person">{label("inPerson", "In person")}</option>
                <option value="online">{label("online", "Online")}</option>
                <option value="hybrid">{label("hybrid", "Hybrid")}</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="preferredLanguage" className="mb-2 block">
                {label("preferredLanguage", "Preferred language")}
              </Label>
              <Select
                id="preferredLanguage"
                name="preferredLanguage"
                value={form.preferredLanguage}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {label("selectOption", "Select an option")}
                </option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </Select>
            </div>
          </div>
            

         {/* Dirección */}
          <div>
            <Label htmlFor="address" className="mb-2 block">
              {label("address", "Address")}
            </Label>
            <TextInput
              id="address"
              name="address"
              placeholder={label("address", "Address")}
              value={form.address || ""}
              onChange={handleChange}
            />
          </div>

          {/* Checkbox: Fill in My Child’s Information */}
          <div className="flex items-center gap-3">
            <Checkbox
                id="childEnabled"
                name="childEnabled"
                checked={form.childEnabled}
                onChange={handleChange}
                className="accent-[#01A6CC]"
            />
            <Label htmlFor="childEnabled" className="cursor-pointer">
                {label("childInfo", "Fill in My Child’s Information")}
            </Label>
          </div>

          {/* Child fields (toggle) */}
          {form.childEnabled && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="childFullName" className="mb-2 block">
                  {label("childFullName", "Full name")}
                </Label>
                <TextInput
                  id="childFullName"
                  name="childFullName"
                  placeholder={label("childFullName", "Full name")}
                  value={form.childFullName}
                  onChange={handleChange}
                />
              </div>

              <div className="max-w-sm">
                <Label htmlFor="childDob" className="mb-2 block">
                  {label("childDob", "Date of birth")}
                </Label>
                <TextInput
                  id="childDob"
                  name="childDob"
                  type="date"
                  placeholder={label("childDob", "Date of birth")}
                  value={form.childDob}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* resumen de slots seleccionados  */}
          {Array.isArray(selected) && selected.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium mb-1">{label("yourSelection", "Your selection")}</p>
              <ul className="list-disc pl-5 space-y-1">
                {selected.map((s, i) => (
                  <li key={i}>
                    {new Date(s.date).toLocaleDateString()} —{" "}
                    {String(s.hour).padStart(2, "0")}:00
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
            <div className="flex items-center justify-end gap-2">
                {/* Botón para volver */}
                {onCancel && (
                    <Button style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc" }} type="button" onClick={onCancel}>
                    {label("back", "Back")}
                    </Button>
                )}

                <Button style={{ backgroundColor: "#01A6CC", color: "#fff", border: "none" }} type="submit">
                    {label("enrollNow", "Enroll Now")}
                </Button>
            </div>
        </form>
      </Card>
    </div>
  );
}