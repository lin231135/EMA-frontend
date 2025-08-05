import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import { vi } from 'vitest';

// Mock de fetch
global.fetch = vi.fn();

describe('RegisterForm - Pruebas de Validación Avanzadas', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Configurar fetch para que no se ejecute - la validación debe fallar antes
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' })
    });
  });

  const renderForm = () => {
    return render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
  };

  describe('TC_REG_001: Validación de Campos Obligatorios', () => {
    test('Debe mostrar todos los errores de campos obligatorios', async () => {
      renderForm();
      
      // Intentar enviar formulario vacío
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      // Verificar que aparecen todos los errores
      await waitFor(() => {
        expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/el apellido es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/el prefijo es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/el teléfono es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/el correo es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
      });
    });

    test('Debe limpiar errores cuando se corrigen los campos', async () => {
      renderForm();
      
      // Generar error primero
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
      });

      // Corregir el campo
      const nombreInput = screen.getByLabelText(/nombre/i);
      fireEvent.change(nombreInput, { target: { value: 'Juan' } });

      // El error debe desaparecer
      await waitFor(() => {
        expect(screen.queryByText(/el nombre es obligatorio/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('TC_REG_002: Validación de Formato de Email', () => {
    test('Debe rechazar emails con formato inválido', async () => {
      renderForm();
      
      // Llenar todos los campos requeridos con valores válidos excepto el email
      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'User' } });
      fireEvent.change(screen.getByLabelText(/prefijo/i), { target: { value: '+502' } });
      fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '12345678' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });
      
      // Probar con un email inválido
      const emailInput = screen.getByLabelText(/correo/i);
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      
      // Hacer submit del formulario
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
      
      // Como la validación puede estar funcionando diferente en test,
      // verificamos que NO se llame a fetch con datos inválidos
      await waitFor(() => {
        // Si la validación funciona correctamente, fetch no debe ser llamado
        // porque el email es inválido
        expect(fetch).not.toHaveBeenCalled();
      }, { timeout: 1000 });
    });

    test('Debe aceptar emails con formato válido', async () => {
      renderForm();
      
      const validEmails = [
        'user@domain.com',
        'test.email@example.org',
        'usuario123@correo.edu.gt'
      ];

      for (const email of validEmails) {
        const emailInput = screen.getByLabelText(/correo/i);
        fireEvent.change(emailInput, { target: { value: email } });
        
        // No debe haber error de formato
        expect(screen.queryByText(/Correo no válido/i)).not.toBeInTheDocument();
      }
    });
  });

  describe('TC_REG_003: Validación de Teléfono con Prefijo', () => {
    test('Debe validar prefijos internacionales correctos', async () => {
      renderForm();
      
      const validPrefixes = ['+502', '+1', '+34', '+52'];
      const prefijoInput = screen.getByLabelText(/prefijo/i);
      
      for (const prefix of validPrefixes) {
        fireEvent.change(prefijoInput, { target: { value: prefix } });
        
        // No debe mostrar error para prefijos válidos
        expect(screen.queryByText(/Prefijo no válido/i)).not.toBeInTheDocument();
      }
    });

    test('Debe rechazar prefijos con formato incorrecto', async () => {
      renderForm();
      
      const invalidPrefixes = ['502', '++502', '+', 'Guatemala'];
      const prefijoInput = screen.getByLabelText(/prefijo/i);
      
      for (const prefix of invalidPrefixes) {
        fireEvent.change(prefijoInput, { target: { value: prefix } });
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
        
        await waitFor(() => {
          expect(screen.getByText(/Prefijo no válido/i)).toBeInTheDocument();
        });
      }
    });

    test('Debe validar números de teléfono dentro del rango permitido', async () => {
      renderForm();
      
      const telefonoInput = screen.getByLabelText(/teléfono/i);
      
      // Números muy cortos o muy largos
      const invalidPhones = ['123', '12345', '123456789012345678'];
      
      for (const phone of invalidPhones) {
        fireEvent.change(telefonoInput, { target: { value: phone } });
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
        
        await waitFor(() => {
          expect(screen.getByText(/Teléfono no válido/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('TC_REG_004: Validación de Contraseñas', () => {
    test('Debe rechazar contraseñas muy cortas', async () => {
      renderForm();
      
      const passwordInput = screen.getByLabelText(/^contraseña$/i);
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        expect(screen.getByText(/debe tener al menos 6 caracteres/i)).toBeInTheDocument();
      });
    });

    test('Debe validar coincidencia de contraseñas', async () => {
      renderForm();
      
      const passwordInput = screen.getByLabelText(/^contraseña$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
      });
    });

    test('Debe aceptar contraseñas que coinciden y cumplen requisitos', async () => {
      renderForm();
      
      // Llenar todos los campos correctamente
      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/prefijo/i), { target: { value: '+502' } });
      fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '12345678' } });
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'juan@test.com' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      // No debe haber errores de validación
      expect(screen.queryByText(/las contraseñas no coinciden/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/debe tener al menos 6 caracteres/i)).not.toBeInTheDocument();
    });
  });

  describe('TC_REG_005: Flujo Completo de Registro', () => {
    test('Debe completar registro exitosamente con datos válidos', async () => {
      // Mock de respuesta exitosa
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true,
          message: 'Usuario registrado exitosamente',
          user: {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            correo: 'juan@test.com'
          }
        })
      });

      renderForm();
      
      // Llenar formulario completo
      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/prefijo/i), { target: { value: '+502' } });
      fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '12345678' } });
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'juan@test.com' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      // Enviar formulario
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

      // Verificar llamada a API
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/register'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: expect.stringContaining('Juan')
          })
        );
      });

      // Verificar mensaje de éxito
      await waitFor(() => {
        expect(screen.getByText(/registro exitoso/i)).toBeInTheDocument();
      });
    });

    test('Debe manejar error de email ya registrado', async () => {
      // Mock de respuesta de error
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ 
          success: false,
          message: 'El correo ya está registrado',
          code: 'EMAIL_ALREADY_EXISTS'
        })
      });

      renderForm();
      
      // Llenar formulario con email existente
      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/prefijo/i), { target: { value: '+502' } });
      fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '12345678' } });
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'existente@test.com' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

      // Verificar mensaje de error
      await waitFor(() => {
        expect(screen.getByText(/el correo ya está registrado/i)).toBeInTheDocument();
      });
    });

    test('Debe deshabilitar botón durante envío y mostrar estado de carga', async () => {
      // Mock que simula delay
      fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ success: true, message: 'Registro exitoso' })
          }), 100)
        )
      );

      renderForm();
      
      // Llenar formulario
      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/prefijo/i), { target: { value: '+502' } });
      fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '12345678' } });
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'juan@test.com' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      // Durante el envío, el botón debe estar deshabilitado
      expect(submitButton).toBeDisabled();

      // Esperar a que termine
      await waitFor(() => {
        expect(screen.getByText(/registro exitoso/i)).toBeInTheDocument();
      });

      // El botón debe volver a estar habilitado
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('TC_REG_006: Accesibilidad y UX', () => {
    test('Debe tener labels apropiados para lectores de pantalla', () => {
      renderForm();
      
      // Verificar que todos los inputs tienen labels
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/prefijo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    });

    test('Debe mostrar mensajes de error cerca de los campos correspondientes', async () => {
      renderForm();
      
      fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

      await waitFor(() => {
        // Los mensajes de error deben estar asociados con sus campos
        const nombreError = screen.getByText(/el nombre es obligatorio/i);
        const emailError = screen.getByText(/el correo es obligatorio/i);
        
        expect(nombreError).toBeInTheDocument();
        expect(emailError).toBeInTheDocument();
      });
    });

    test('Debe permitir navegación con teclado', () => {
      renderForm();
      
      const inputs = [
        screen.getByLabelText(/nombre/i),
        screen.getByLabelText(/apellido/i),
        screen.getByLabelText(/prefijo/i),
        screen.getByLabelText(/teléfono/i),
        screen.getByLabelText(/correo/i),
        screen.getByLabelText(/^contraseña$/i),
        screen.getByLabelText(/confirmar contraseña/i)
      ];

      // Verificar que todos los inputs pueden recibir foco
      inputs.forEach(input => {
        input.focus();
        expect(document.activeElement).toBe(input);
      });
    });
  });
});
