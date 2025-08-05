// Mock de window.alert para LoginForm
window.alert = vi.fn();

// Mock mejorado de localStorage que persiste durante las pruebas
export const createMockLocalStorage = () => {
  const store = new Map();
  return {
    getItem: vi.fn((key) => store.get(key) || null),
    setItem: vi.fn((key, value) => store.set(key, value)),
    removeItem: vi.fn((key) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    get length() { return store.size; },
    key: vi.fn((index) => Array.from(store.keys())[index] || null)
  };
};

// Helper para renderizar componentes con Router
export const renderWithRouter = (component, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

// Helper para seleccionar elementos únicos cuando hay duplicados
export const getUniqueElement = (screen, role, name, containerSelector = null) => {
  const elements = screen.getAllByRole(role, { name });
  if (elements.length === 1) return elements[0];
  
  if (containerSelector) {
    // Buscar dentro de un contenedor específico
    const container = document.querySelector(containerSelector);
    if (container) {
      return within(container).getByRole(role, { name });
    }
  }
  
  // Devolver el primer elemento si no se puede disambiguar
  return elements[0];
};

// Mock de fetch mejorado que simula delays reales
export const createMockFetch = (responses = []) => {
  let callCount = 0;
  return vi.fn().mockImplementation(async (url, options) => {
    const response = responses[callCount] || responses[responses.length - 1];
    callCount++;
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 10));
    
    return Promise.resolve({
      ok: response.ok !== false,
      status: response.status || 200,
      json: async () => response.data || response,
      text: async () => JSON.stringify(response.data || response)
    });
  });
};

// Utilidades para testing de componentes con estado
export const waitForStateUpdate = async (callback, timeout = 1000) => {
  return waitFor(callback, { timeout });
};

// Helper para testing de formularios
export const fillForm = (fields) => {
  Object.entries(fields).forEach(([fieldName, value]) => {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i'));
    fireEvent.change(field, { target: { value } });
  });
};

// Helper para testing de navegación
export const expectNavigation = (history, expectedPath) => {
  expect(history.location.pathname).toBe(expectedPath);
};

export { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
export { MemoryRouter } from 'react-router-dom';
export { vi } from 'vitest';
