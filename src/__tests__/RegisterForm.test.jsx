import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../components/forms/RegisterForm';
import { vi } from 'vitest';

// Simulamos la función global fetch
global.fetch = vi.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('1. Renderiza todos los campos del formulario', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prefijo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
  });

  test('2. Muestra errores si los campos están vacíos', async () => {
    render(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el apellido es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el prefijo es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el teléfono es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el correo es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
  });

  test('3. Muestra error si las contraseñas no coinciden', async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/prefijo/i), { target: { value: '+502' } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@correo.com' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'clave123' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'otra123' } });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  test('4. Registro exitoso muestra mensaje', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Usuario registrado exitosamente' })
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/prefijo/i), { target: { value: '+502' } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'nuevo@correo.com' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'test123' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'test123' } });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/¡registro exitoso/i)).toBeInTheDocument();
  });

  test('5. Muestra error si el correo ya existe', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'El correo ya está registrado' })
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Repetido' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Usuario' } });
    fireEvent.change(screen.getByLabelText(/prefijo/i), { target: { value: '+502' } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '87654321' } });
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'admin@academia.com' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'admin123' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'admin123' } });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/el correo ya está registrado/i)).toBeInTheDocument();
  });
});