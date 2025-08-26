import { screen } from '@testing-library/react';
import Home from '../components/pages/Home';
import { renderWithProviders } from './test-utils.jsx';

describe('Home Page - Tests Simplificados', () => {
  test('Debe renderizar la página Home correctamente', () => {
    renderWithProviders(<Home />);
    
    // Verificaciones básicas
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('Debe mostrar navegación', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('Debe renderizar sin errores', () => {
    renderWithProviders(<Home />);
    
    // Si llega aquí sin throw, el test pasa
    expect(true).toBe(true);
  });
});
