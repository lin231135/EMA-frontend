// src/components/forms/__tests__/LoginForm.test.jsx
import { test, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../__tests__/test-utils';
import LoginForm from '../LoginForm';

// Mock del módulo de navegación
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  };
});

// Mock de PageLayout para simplificar el test
vi.mock('../../layout/PageLayout', () => ({
  default: ({ children }) => <div data-testid="page-layout">{children}</div>,
}));

// Mock de RegisterImageCard
vi.mock('../RegisterCards', () => ({
  RegisterImageCard: () => <div data-testid="register-image-card">Image</div>,
}));

// Mock de WelcomeModal
vi.mock('../../ui/WelcomeModal', () => ({
  default: ({ open, onConfirm }) => 
    open ? <div data-testid="welcome-modal"><button onClick={onConfirm}>Confirm</button></div> : null,
}));

// Mock de PasswordModal
vi.mock('../Popup', () => ({
  default: ({ isOpen, onClose }) => 
    isOpen ? <div data-testid="password-modal"><button onClick={onClose}>Close</button></div> : null,
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    // Limpia los mocks antes de cada test
    vi.clearAllMocks();
    mockNavigate.mockClear();
    
    // Mock de fetch para simular respuestas del backend
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders login form with all required elements', () => {
    renderWithProviders(<LoginForm />);
    
    // Verifica que los elementos principales estén presentes
    expect(document.getElementById('email')).toBeInTheDocument();
    expect(document.getElementById('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión|login/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /recordar|remember/i })).toBeInTheDocument();
  });

  test('displays error for invalid email format', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorMessage = screen.queryByText(/correo|email.*inválido|invalid/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('submits form with valid credentials and redirects on success', async () => {
    const user = userEvent.setup();
    
    // Mock de respuesta exitosa del login
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-jwt-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'admin',
          is_first_login: false,
        },
      }),
    });
    
    renderWithProviders(<LoginForm />);
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Verifica que se haya llamado al endpoint de login
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
    });
    
    // Verifica que se muestre el modal de bienvenida
    await waitFor(() => {
      expect(screen.getByTestId('welcome-modal')).toBeInTheDocument();
    });
  });

  test('displays error message on failed login', async () => {
    const user = userEvent.setup();
    
    // Mock de respuesta fallida del login
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Credenciales inválidas',
      }),
    });
    
    renderWithProviders(<LoginForm />);
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
    
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorMessage = screen.queryByText(/credenciales|inválid|error/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('toggles remember me checkbox', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /recordar|remember/i });
    
    expect(rememberMeCheckbox).not.toBeChecked();
    
    await user.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
    
    await user.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
  });

  test('opens password reset modal when forgot password is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    
    const forgotPasswordButton = screen.getByRole('button', { name: /olvidaste.*contraseña/i });
    await user.click(forgotPasswordButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('password-modal')).toBeInTheDocument();
    });
  });

  test('shows password reset modal for first-time login users', async () => {
    const user = userEvent.setup();
    
    // Mock de respuesta con primer inicio de sesión
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-jwt-token',
        user: {
          id: 1,
          name: 'New User',
          email: 'new@example.com',
          role: 'estudiante',
          is_first_login: true,
        },
      }),
    });
    
    renderWithProviders(<LoginForm />);
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
    
    await user.type(emailInput, 'new@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Verifica que se muestre el modal de reseteo de contraseña
    await waitFor(() => {
      expect(screen.getByTestId('password-modal')).toBeInTheDocument();
    });
    
    // No debe mostrar el modal de bienvenida
    expect(screen.queryByTestId('welcome-modal')).not.toBeInTheDocument();
  });

  test('navigates to correct route based on user role after welcome modal confirm', async () => {
    const user = userEvent.setup();
    
    // Mock de respuesta exitosa del login
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-jwt-token',
        user: {
          id: 2,
          name: 'Parent User',
          email: 'parent@example.com',
          role: 'padre',
          is_first_login: false,
        },
      }),
    });
    
    renderWithProviders(<LoginForm />);
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
    
    await user.type(emailInput, 'parent@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Espera a que aparezca el modal de bienvenida
    await waitFor(() => {
      expect(screen.getByTestId('welcome-modal')).toBeInTheDocument();
    });
    
    // Confirma el modal
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);
    
    // Verifica que se navegue a la ruta correcta para padre
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/parent/ParentProfileSelect');
    });
  });

  test('has link to registration page', () => {
    renderWithProviders(<LoginForm />);
    
    const registerLink = screen.getByRole('link', { name: /regístrate/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock de error de red
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    renderWithProviders(<LoginForm />);
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorMessage = screen.queryByText(/network|error/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
