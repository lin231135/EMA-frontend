import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PreRegisterForm from "../components/PreRegisterForm";

// Mock del contexto useAuth
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ lang: "es" }),
}));

// Mock de traducciones mínimas (puedes adaptarlo según tu archivo real)
jest.mock("../../translations", () => ({
  es: {
    common: {
      back: "Atrás",
      enrollNow: "Inscribirse",
      selectOption: "Seleccione una opción",
    },
    preregister: {
      preRegisterIntro1: "Intro 1",
      preRegisterIntro2: "Intro 2",
      preRegisterIntro3: "Intro 3",
      preRegisterIntro4: "Intro 4",
      registrationTitle: "Formulario de Pre-registro",
      fullName: "Nombre completo",
      email: "Correo",
      phone: "Teléfono",
      dob: "Fecha de nacimiento",
      preferredFormat: "Formato preferido",
      inPerson: "Presencial",
      online: "En línea",
      hybrid: "Híbrido",
      preferredLanguage: "Idioma preferido",
      address: "Dirección",
      childInfo: "Agregar información de hijo",
      childFullName: "Nombre del hijo",
      childDob: "Fecha de nacimiento del hijo",
    },
  },
}));

describe("PreRegisterForm", () => {
  test("renderiza los campos principales", () => {
    render(<PreRegisterForm />);

    expect(screen.getByLabelText("Nombre completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo")).toBeInTheDocument();
    expect(screen.getByLabelText("Teléfono")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de nacimiento")).toBeInTheDocument();
    expect(screen.getByLabelText("Formato preferido")).toBeInTheDocument();
    expect(screen.getByLabelText("Idioma preferido")).toBeInTheDocument();
  });

  test("muestra y oculta campos de hijo según el checkbox", () => {
    render(<PreRegisterForm />);

    const checkbox = screen.getByLabelText("Agregar información de hijo");

    // Al inicio está marcado (childEnabled = true)
    expect(screen.getByLabelText("Nombre del hijo")).toBeInTheDocument();

    // Lo desmarcamos → los campos desaparecen
    fireEvent.click(checkbox);
    expect(screen.queryByLabelText("Nombre del hijo")).not.toBeInTheDocument();
  });

  test("ejecuta onSubmit con los datos del formulario", () => {
    const mockSubmit = jest.fn();
    render(<PreRegisterForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText("Nombre completo"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento"), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Formato preferido"), {
      target: { value: "online" },
    });
    fireEvent.change(screen.getByLabelText("Idioma preferido"), {
      target: { value: "es" },
    });
    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "Ciudad de Guatemala" },
    });

    // Campos de hijo
    fireEvent.change(screen.getByLabelText("Nombre del hijo"), {
      target: { value: "Peque Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de nacimiento del hijo"), {
      target: { value: "2015-05-05" },
    });

    fireEvent.click(screen.getByText("Inscribirse"));

    expect(mockSubmit).toHaveBeenCalled();
    const submittedData = mockSubmit.mock.calls[0][0];
    expect(submittedData.fullName).toBe("Juan Pérez");
    expect(submittedData.email).toBe("juan@test.com");
    expect(submittedData.childFullName).toBe("Peque Pérez");
  });

  test("ejecuta onCancel al hacer clic en Atrás", () => {
    const mockCancel = jest.fn();
    render(<PreRegisterForm onCancel={mockCancel} />);

    fireEvent.click(screen.getByText("Atrás"));
    expect(mockCancel).toHaveBeenCalled();
  });
});
