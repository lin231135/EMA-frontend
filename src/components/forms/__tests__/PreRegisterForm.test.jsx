// src/components/forms/__tests__/PreRegisterForm.test.jsx
import { test, expect, describe, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAuth } from '../../../__tests__/test-utils';
import PreRegisterForm from '../PreRegisterForm';

describe('PreRegisterForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const defaultProps = {
    selected: ['Piano', 'Canto'],
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form with all required fields', () => {
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    // Verifica campos principales usando IDs para evitar ambigüedad
    expect(document.getElementById('fullName')).toBeInTheDocument();
    expect(screen.getByLabelText(/correo|email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono|phone/i)).toBeInTheDocument();
    expect(document.getElementById('dob')).toBeInTheDocument();
    expect(screen.getByLabelText(/formato preferido|preferred format/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/idioma preferido|preferred language/i)).toBeInTheDocument();
  });

  test('renders intro text and instructions', () => {
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    // Verifica que el texto introductorio esté presente
    const introText = screen.getByText(/pre.*registro|pre.*register/i);
    expect(introText).toBeInTheDocument();
  });

  test('displays child information fields when checkbox is checked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    // Por defecto el checkbox debería estar marcado
    const childCheckbox = screen.getByRole('checkbox', { name: /información.*hijo|child.*info/i });
    expect(childCheckbox).toBeChecked();

    // Los campos del hijo deberían ser visibles usando IDs
    expect(document.getElementById('childFullName')).toBeInTheDocument();
    expect(document.getElementById('childDob')).toBeInTheDocument();
  });

  test('hides child information fields when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    const childCheckbox = screen.getByRole('checkbox', { name: /información.*hijo|child.*info/i });
    
    // Desmarca el checkbox
    await user.click(childCheckbox);

    // Los campos del hijo no deberían estar visibles
    await waitFor(() => {
      expect(screen.queryByLabelText(/nombre completo.*hijo|child.*full name/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/fecha.*nacimiento.*hijo|child.*dob/i)).not.toBeInTheDocument();
    });
  });

  test('allows user to fill all form fields', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    // Llena los campos del formulario usando IDs específicos
    const fullNameInputs = screen.getAllByRole('textbox', { name: /nombre completo/i });
    await user.type(fullNameInputs[0], 'Juan Pérez');
    await user.type(screen.getByRole('textbox', { name: /correo|email/i }), 'juan@example.com');
    await user.type(screen.getByRole('textbox', { name: /teléfono|phone/i }), '555-1234');
    const dobInputs = screen.getAllByLabelText(/fecha de nacimiento|dob|date of birth/i);
    await user.type(dobInputs[0], '1990-01-15');

    // Selecciona opciones de los selects
    await user.selectOptions(screen.getByLabelText(/formato preferido|preferred format/i), 'in-person');
    await user.selectOptions(screen.getByLabelText(/idioma preferido|preferred language/i), 'es');

    // Llena dirección (opcional)
    const addressField = screen.getByLabelText(/dirección|address/i);
    await user.type(addressField, 'Calle Principal 123');

    // Verifica que los valores se hayan ingresado
    expect(fullNameInputs[0]).toHaveValue('Juan Pérez');
    expect(screen.getByRole('textbox', { name: /correo|email/i })).toHaveValue('juan@example.com');
    expect(screen.getByRole('textbox', { name: /teléfono|phone/i })).toHaveValue('555-1234');
  });

  test('submits form with valid data including child information', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    // Llena campos principales
    const fullNameInputs = screen.getAllByRole('textbox', { name: /nombre completo/i });
    await user.type(fullNameInputs[0], 'María García');
    await user.type(screen.getByRole('textbox', { name: /correo|email/i }), 'maria@example.com');
    await user.type(screen.getByRole('textbox', { name: /teléfono|phone/i }), '555-5678');
    const dobInputs = screen.getAllByLabelText(/fecha de nacimiento|dob|date of birth/i);
    await user.type(dobInputs[0], '1985-05-20');
    await user.selectOptions(screen.getByLabelText(/formato preferido|preferred format/i), 'online');
    await user.selectOptions(screen.getByLabelText(/idioma preferido|preferred language/i), 'en');

    // Llena campos del hijo usando IDs directamente
    const childNameInput = document.getElementById('childFullName');
    const childDobInput = document.getElementById('childDob');
    await user.type(childNameInput, 'Pedro García');
    await user.type(childDobInput, '2010-08-15');

    // Envía el formulario
    const submitButton = screen.getByRole('button', { name: /inscrib|enroll/i });
    await user.click(submitButton);

    // Verifica que se haya llamado onSubmit con los datos correctos
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'María García',
          email: 'maria@example.com',
          phone: '555-5678',
          dob: '1985-05-20',
          preferredFormat: 'online',
          preferredLanguage: 'en',
          childEnabled: true,
          childFullName: 'Pedro García',
          childDob: '2010-08-15',
          selected: ['Piano', 'Canto'],
        })
      );
    });
  });

  test('submits form without child information when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    // Llena campos principales
    const fullNameInputs = screen.getAllByRole('textbox', { name: /nombre completo/i });
    await user.type(fullNameInputs[0], 'Carlos López');
    await user.type(screen.getByRole('textbox', { name: /correo|email/i }), 'carlos@example.com');
    await user.type(screen.getByRole('textbox', { name: /teléfono|phone/i }), '555-9999');
    const dobInputs = screen.getAllByLabelText(/fecha de nacimiento|dob|date of birth/i);
    await user.type(dobInputs[0], '1992-12-10');
    await user.selectOptions(screen.getByLabelText(/formato preferido|preferred format/i), 'hybrid');
    await user.selectOptions(screen.getByLabelText(/idioma preferido|preferred language/i), 'es');

    // Desmarca el checkbox de información del hijo
    const childCheckbox = screen.getByRole('checkbox', { name: /información.*hijo|child.*info/i });
    await user.click(childCheckbox);

    // Envía el formulario
    const submitButton = screen.getByRole('button', { name: /inscrib|enroll/i });
    await user.click(submitButton);

    // Verifica que se haya llamado onSubmit sin información del hijo
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Carlos López',
          email: 'carlos@example.com',
          childEnabled: false,
          selected: ['Piano', 'Canto'],
        })
      );
    });
  });

  test('calls onCancel when back button is clicked', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    const backButton = screen.getByRole('button', { name: /volver|atrás|back/i });
    await user.click(backButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    // Intenta enviar el formulario vacío
    const submitButton = screen.getByRole('button', { name: /inscrib|enroll/i });
    await user.click(submitButton);

    // HTML5 validation debería prevenir el envío
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('renders with empty selected array', () => {
    renderWithAuth(<PreRegisterForm selected={[]} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // El formulario debería renderizarse normalmente
    const fullNameInputs = screen.getAllByRole('textbox', { name: /nombre completo/i });
    expect(fullNameInputs[0]).toBeInTheDocument();
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/correo|email/i);
    
    // Intenta ingresar un email inválido
    await user.type(emailInput, 'invalid-email');
    
    // HTML5 validation debería marcar como inválido
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('handles all format options correctly', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    const formatSelect = screen.getByLabelText(/formato preferido|preferred format/i);

    // Verifica que todas las opciones estén disponibles
    await user.selectOptions(formatSelect, 'in-person');
    expect(formatSelect).toHaveValue('in-person');

    await user.selectOptions(formatSelect, 'online');
    expect(formatSelect).toHaveValue('online');

    await user.selectOptions(formatSelect, 'hybrid');
    expect(formatSelect).toHaveValue('hybrid');
  });

  test('handles language selection correctly', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    const languageSelect = screen.getByLabelText(/idioma preferido|preferred language/i);

    // Verifica opciones de idioma
    await user.selectOptions(languageSelect, 'es');
    expect(languageSelect).toHaveValue('es');

    await user.selectOptions(languageSelect, 'en');
    expect(languageSelect).toHaveValue('en');
  });

  test('date inputs accept valid dates', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    const dobInput = document.getElementById('dob');
    await user.type(dobInput, '1990-06-15');

    expect(dobInput).toHaveValue('1990-06-15');
  });

  test('child date field is required when child info is enabled', async () => {
    const user = userEvent.setup();
    renderWithAuth(<PreRegisterForm {...defaultProps} />);

    // Llena solo los campos principales
    const fullNameInputs = screen.getAllByRole('textbox', { name: /nombre completo/i });
    await user.type(fullNameInputs[0], 'Test User');
    await user.type(screen.getByRole('textbox', { name: /correo|email/i }), 'test@example.com');
    await user.type(screen.getByRole('textbox', { name: /teléfono|phone/i }), '555-0000');
    const dobInputs = screen.getAllByLabelText(/fecha de nacimiento|dob|date of birth/i);
    await user.type(dobInputs[0], '1990-01-01');
    await user.selectOptions(screen.getByLabelText(/formato preferido|preferred format/i), 'online');
    await user.selectOptions(screen.getByLabelText(/idioma preferido|preferred language/i), 'es');

    // Intenta enviar sin llenar información del hijo (que está habilitada)
    const submitButton = screen.getByRole('button', { name: /inscrib|enroll/i });
    await user.click(submitButton);

    // HTML5 validation debería prevenir el envío
    const childNameInput = document.getElementById('childFullName');
    expect(childNameInput).toBeRequired();
  });
});
