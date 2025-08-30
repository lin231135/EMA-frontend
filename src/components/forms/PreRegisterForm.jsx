import React, { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import translations from "../../translations";
import { useAuth } from "../../contexts/AuthContext";

export default function PreRegisterForm({
  selected = [],
  onCancel,
  onSubmit,
}) {
  const { lang } = useAuth();
  const t = {
    ...translations[lang].common,
    ...translations[lang].preregister,
  };
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

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
      {/* Intro text */}
      <div className="mb-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <p className="mb-2">{t.preRegisterIntro1}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t.preRegisterIntro2}</li>
          <li>{t.preRegisterIntro3}</li>
        </ul>
        <p className="mt-2">{t.preRegisterIntro4}</p>
      </div>

      <Card className="bg-white dark:bg-gray-900">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
          {t.registrationTitle}
        </h1>
        <form onSubmit={handleSubmit} className="mt-2 space-y-6">
          {/* Full name */}
          <div>
            <Label htmlFor="fullName" className="mb-2 block">
              {t.fullName}
            </Label>
            <TextInput
              id="fullName"
              name="fullName"
              placeholder={t.fullName}
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-2 block">
              {t.email}
            </Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder={t.email}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="mb-2 block">
              {t.phone}
            </Label>
            <TextInput
              id="phone"
              name="phone"
              type="tel"
              placeholder={t.phone}
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* DOB */}
          <div>
            <Label htmlFor="dob" className="mb-2 block">
              {t.dob}
            </Label>
            <TextInput
              id="dob"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
            />
          </div>

          {/* Preferred format */}
          <div>
            <Label htmlFor="preferredFormat" className="mb-2 block">
              {t.preferredFormat}
            </Label>
            <Select
              id="preferredFormat"
              name="preferredFormat"
              value={form.preferredFormat}
              onChange={handleChange}
              required
            >
              <option value="">{t.selectOption}</option>
              <option value="in-person">{t.inPerson}</option>
              <option value="online">{t.online}</option>
              <option value="hybrid">{t.hybrid}</option>
            </Select>
          </div>

          {/* Preferred language */}
          <div>
            <Label htmlFor="preferredLanguage" className="mb-2 block">
              {t.preferredLanguage}
            </Label>
            <Select
              id="preferredLanguage"
              name="preferredLanguage"
              value={form.preferredLanguage}
              onChange={handleChange}
              required
            >
              <option value="">{t.selectOption}</option>
              <option value="es">Español</option>
              <option value="en">English</option>
            </Select>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="mb-2 block">
              {t.address}
            </Label>
            <TextInput
              id="address"
              name="address"
              placeholder={t.address}
              value={form.address}
              onChange={handleChange}
            />
          </div>

          {/* Child info toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="childEnabled"
              name="childEnabled"
              checked={form.childEnabled}
              onChange={handleChange}
            />
            <Label htmlFor="childEnabled">{t.childInfo}</Label>
          </div>

          {/* Child info fields */}
          {form.childEnabled && (
            <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div>
                <Label htmlFor="childFullName" className="mb-2 block">
                  {t.childFullName}
                </Label>
                <TextInput
                  id="childFullName"
                  name="childFullName"
                  placeholder={t.childFullName}
                  value={form.childFullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="childDob" className="mb-2 block">
                  {t.childDob}
                </Label>
                <TextInput
                  id="childDob"
                  name="childDob"
                  type="date"
                  value={form.childDob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              color="light"
              className="w-full sm:w-auto"
            >
              {t.back}
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {t.enrollNow}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
