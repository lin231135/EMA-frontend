// src/components/forms/__tests__/PaymentForm.test.jsx
import { test, expect, describe, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAuth } from '../../../__tests__/test-utils';
import PaymentForm from '../PaymentForm';

// Mock de servicios
vi.mock('../../../services/admin/adminUsersService', () => ({
  getUsers: vi.fn(),
  getChildrenByParentId: vi.fn(),
}));

vi.mock('../../../services/app/uploadService', () => ({
  uploadPaymentProof: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

import { getUsers, getChildrenByParentId } from '../../../services/admin/adminUsersService';
import { uploadPaymentProof } from '../../../services/app/uploadService';

describe('PaymentForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    contextRole: 'padre',
    showHeader: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form rendering', () => {
    test('renders form with all required fields', () => {
      renderWithAuth(<PaymentForm {...defaultProps} />);

      expect(document.getElementById('studentName')).toBeInTheDocument();
      expect(document.getElementById('date')).toBeInTheDocument();
      expect(document.getElementById('total')).toBeInTheDocument();
      expect(document.getElementById('paymentMethod')).toBeInTheDocument();
    });

    test('renders with default payment method', () => {
      renderWithAuth(<PaymentForm {...defaultProps} />);

      const methodSelect = document.getElementById('paymentMethod');
      expect(methodSelect).toBeInTheDocument();
      expect(methodSelect.value).toBeTruthy();
    });
  });

  describe('Form interactions', () => {
    test('handles file upload for payment proof', async () => {
      const user = userEvent.setup();
      renderWithAuth(<PaymentForm {...defaultProps} />);

      const file = new File(['payment proof'], 'proof.png', { type: 'image/png' });
      const fileInput = document.getElementById('proof');

      await user.upload(fileInput, file);

      expect(fileInput.files[0]).toBe(file);
      expect(fileInput.files).toHaveLength(1);
    });
  });







  describe('Initial values', () => {
    test('pre-fills form with initial values', () => {
      const initialValues = {
        studentName: 'Laura Martínez',
        date: '2024-06-10',
        total: '950',
        method: 'efectivo',
        notes: 'Pago de junio',
      };

      renderWithAuth(<PaymentForm {...defaultProps} initialValues={initialValues} />);

      expect(document.getElementById('studentName')).toHaveValue('Laura Martínez');
      expect(document.getElementById('date')).toHaveValue('2024-06-10');
      expect(document.getElementById('total')).toHaveValue(950);
      expect(document.getElementById('paymentMethod')).toHaveValue('cash');
    });

    test('respects read-only fields', () => {
      const initialValues = {
        studentName: 'Roberto Díaz',
      };

      const readOnlyFields = {
        studentName: true,
      };

      renderWithAuth(
        <PaymentForm 
          {...defaultProps} 
          initialValues={initialValues} 
          readOnlyFields={readOnlyFields} 
        />
      );

      const studentNameInput = document.getElementById('studentName');
      expect(studentNameInput).toHaveAttribute('readOnly');
      expect(studentNameInput).toHaveValue('Roberto Díaz');
    });
  });

  describe('Cancel functionality', () => {
    test('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderWithAuth(<PaymentForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancelar|cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });
});
