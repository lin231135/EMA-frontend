import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import About from '../components/pages/About';
import { vi } from 'vitest';

// Mock de React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock del Intersection Observer para animaciones
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock del localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock de window.location
delete window.location;
window.location = { href: '', assign: vi.fn() };

describe('About Page - Casos de Prueba de UI/UX', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    window.location.href = '';
    window.location.assign.mockClear();
  });

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  describe('TC_ABOUT_001: Estructura y Contenido Institucional', () => {
    test('Debe mostrar toda la información institucional clave', () => {
      renderWithRouter(<About />);

      // Verificar secciones institucionales principales (usar getAll para múltiples elementos)
      expect(screen.getAllByText(/misión|mission/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/visión|vision/i)).toBeInTheDocument();
      expect(screen.getAllByText(/compromiso|commitment/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/carrera profesional|professional career/i)).toBeInTheDocument();

      // Verificar contenido descriptivo de misión
      expect(screen.getByText(/educación musical de excelencia|excellence in music education/i)).toBeInTheDocument();
      
      // Verificar información de la maestra
      expect(screen.getByText(/elizabeth delgado/i)).toBeInTheDocument();
      expect(screen.getByText(/10 años|10 years/i)).toBeInTheDocument();
      expect(screen.getByText(/conservatorio nacional|national conservatory/i)).toBeInTheDocument();
    });

    test('Debe mostrar sección de recitales correctamente', () => {
      renderWithRouter(<About />);

      // Usar getAll para elementos que pueden aparecer múltiples veces
      expect(screen.getAllByText(/recitales|recitals/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/presentaciones públicas|public presentations/i)).toBeInTheDocument();
      expect(screen.getAllByText(/confianza|confidence/i)[0]).toBeInTheDocument();
    });

    test('Debe cambiar contenido al cambiar idioma', async () => {
      renderWithRouter(<About />);

      // Verificar contenido inicial en español
      expect(screen.getByText('Misión')).toBeInTheDocument();
      expect(screen.getByText(/educación musical de excelencia/i)).toBeInTheDocument();

      // Cambiar a inglés
      const languageButton = screen.getByRole('button', { name: /EN/i });
      fireEvent.click(languageButton);

      // Verificar cambio a inglés
      await waitFor(() => {
        expect(screen.getByText('Mission')).toBeInTheDocument();
        expect(screen.getByText(/excellence in music education/i)).toBeInTheDocument();
      });
    });
  });

  describe('TC_ABOUT_002: Sistema de Testimonios', () => {
    test('Debe mostrar testimonios de estudiantes y padres', () => {
      renderWithRouter(<About />);

      // Verificar sección de testimonios
      expect(screen.getByText(/testimonios|testimonials/i)).toBeInTheDocument();
      
      // Verificar testimonios específicos
      expect(screen.getByText(/maría gonzález/i)).toBeInTheDocument();
      expect(screen.getByText(/carlos rodríguez/i)).toBeInTheDocument();
      
      // Verificar contenido de testimonios
      expect(screen.getByText(/transformadoras|transformative/i)).toBeInTheDocument();
      expect(screen.getByText(/disciplina|discipline/i)).toBeInTheDocument();
      expect(screen.getByText(/confianza en sí misma|self-confidence/i)).toBeInTheDocument();
    });

    test('Debe mostrar calificaciones en estrellas correctamente', () => {
      renderWithRouter(<About />);

      // Buscar elementos de calificación (asumiendo que TestimonialCard muestra estrellas)
      const ratingElements = screen.getAllByText(/★|⭐/);
      expect(ratingElements.length).toBeGreaterThan(0);
    });

    test('Debe mostrar roles de los testimonios', () => {
      renderWithRouter(<About />);

      // Usar getAll para elementos que pueden aparecer múltiples veces
      expect(screen.getAllByText(/madre de estudiante|student's mother/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/estudiante adulto|adult student/i)).toBeInTheDocument();
    });

    test('Debe adaptar testimonios al idioma seleccionado', async () => {
      renderWithRouter(<About />);

      // Verificar testimonio en español
      expect(screen.getByText(/han sido transformadoras/i)).toBeInTheDocument();
      expect(screen.getAllByText(/madre de estudiante/i)[0]).toBeInTheDocument();

      // Cambiar a inglés
      const languageButton = screen.getByRole('button', { name: /EN/i });
      fireEvent.click(languageButton);

      // Verificar cambio a inglés
      await waitFor(() => {
        expect(screen.getByText(/have been transformative/i)).toBeInTheDocument();
        expect(screen.getAllByText(/student's mother/i)[0]).toBeInTheDocument();
      });
    });
  });

  describe('TC_ABOUT_003: Galería de Recitales', () => {
    test('Debe mostrar información de recitales programados', () => {
      renderWithRouter(<About />);

      // Verificar que se muestran recitales
      const recitalElements = screen.getAllByText(/recital|concierto/i);
      expect(recitalElements.length).toBeGreaterThan(0);
    });

    test('Debe mostrar fechas y ubicaciones de recitales', () => {
      renderWithRouter(<About />);

      // Buscar elementos de fecha (formato puede variar)
      const dateElements = screen.getAllByText(/2024|diciembre|junio|marzo|december|june|march/i);
      expect(dateElements.length).toBeGreaterThan(0);
      
      // Los recitales no tienen ubicaciones específicas, verificar descripción
      expect(screen.getByText(/presentación de todos los estudiantes|performance by all students/i)).toBeInTheDocument();
    });

    test('Debe alternar idioma en información de recitales', async () => {
      renderWithRouter(<About />);

      // Cambiar a inglés
      const languageButton = screen.getByRole('button', { name: /EN/i });
      fireEvent.click(languageButton);

      await waitFor(() => {
        // Verificar que las fechas y descripciones cambian de idioma apropiadamente
        expect(screen.getByText(/performance by all students/i)).toBeInTheDocument();
      });
    });
  });

  describe('TC_ABOUT_004: Navegación y Enlaces', () => {
    test('Debe mantener navegación consistente con Home', () => {
      renderWithRouter(<About />);

      // Verificar elementos de navegación
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /inicio|home/i })[0]).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /nosotros|about/i })[0]).toBeInTheDocument();
    });

    test('Debe manejar autenticación correctamente', () => {
      renderWithRouter(<About />);

      // Los botones de autenticación están dentro del dropdown del avatar
      // Hacer click en el avatar para abrir el dropdown
      const avatarButton = screen.getAllByRole('button')[1]; // El segundo button es el avatar
      fireEvent.click(avatarButton);

      // Ahora verificar opciones de autenticación en el dropdown
      expect(screen.getByText(/iniciar sesión|sign in/i)).toBeInTheDocument();
      expect(screen.getByText(/registrarse|sign up/i)).toBeInTheDocument();
    });

    test('Debe redirigir al login cuando se hace clic en "Iniciar Sesión"', () => {
      renderWithRouter(<About />);

      // Abrir dropdown del avatar
      const avatarButton = screen.getAllByRole('button')[1]; // El segundo button es el avatar
      fireEvent.click(avatarButton);

      // Buscar y hacer click en el botón de login
      const loginButton = screen.getByText(/iniciar sesión|sign in/i);
      fireEvent.click(loginButton);

      expect(window.location.href).toBe('/login');
    });

    test('Debe redirigir al registro cuando se hace clic en "Registrarse"', () => {
      renderWithRouter(<About />);

      // Abrir dropdown del avatar
      const avatarButton = screen.getAllByRole('button')[1]; // El segundo button es el avatar
      fireEvent.click(avatarButton);

      // Buscar y hacer click en el botón de registro
      const registerButton = screen.getByText(/registrarse|sign up/i);
      fireEvent.click(registerButton);

      expect(window.location.href).toBe('/register');
    });
  });

  describe('TC_ABOUT_005: Elementos Multimedia y Visuales', () => {
    test('Debe mostrar imagen de la maestra', () => {
      renderWithRouter(<About />);

      const teacherImage = screen.getByAltText(/teacher|maestra|profesora/i);
      expect(teacherImage).toBeInTheDocument();
      expect(teacherImage).toHaveAttribute('src', 'public/teacher.jpg');
    });

    test('Debe manejar error de carga de imagen graciosamente', () => {
      renderWithRouter(<About />);

      const teacherImage = screen.getByAltText(/teacher|maestra|profesora/i);
      
      // Simular error de carga
      fireEvent.error(teacherImage);
      
      // La imagen debe seguir en el DOM
      expect(teacherImage).toBeInTheDocument();
    });

    test('Debe mostrar elementos visuales de las tarjetas correctamente', () => {
      renderWithRouter(<About />);

      // Verificar que las tarjetas tienen la estructura visual esperada
      const testimonialCards = screen.getAllByText(/★|⭐|rating/i);
      expect(testimonialCards.length).toBeGreaterThan(0);
    });
  });

  describe('TC_ABOUT_006: Rendimiento y Optimización', () => {
    test('Debe renderizar rápidamente sin errores de consola', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      renderWithRouter(<About />);

      // Verificar que no hay errores en consola
      expect(consoleSpy).not.toHaveBeenCalled();
      
      // Verificar que el componente renderiza completamente
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('Debe manejar cambios rápidos de idioma sin errores', async () => {
      renderWithRouter(<About />);

      const languageButton = screen.getByRole('button', { name: /EN/i });
      
      // Cambios rápidos de idioma
      fireEvent.click(languageButton);
      fireEvent.click(screen.getByRole('button', { name: /ES/i }));
      fireEvent.click(screen.getByRole('button', { name: /EN/i }));

      // Verificar que el componente sigue funcionando
      await waitFor(() => {
        expect(screen.getAllByText(/Mission|Misión/i)[0]).toBeInTheDocument();
      });
    });

    test('Debe ser accesible con lectores de pantalla', () => {
      renderWithRouter(<About />);

      // Verificar estructura semántica
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer

      // Verificar headings jerárquicos
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Verificar que hay al menos un h1
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('TC_ABOUT_007: Estados de Interacción', () => {
    test('Debe mantener el estado del idioma al interactuar con otros elementos', async () => {
      renderWithRouter(<About />);

      // Cambiar a inglés
      const languageButton = screen.getByRole('button', { name: /EN/i });
      fireEvent.click(languageButton);

      await waitFor(() => {
        expect(screen.getByText('Mission')).toBeInTheDocument();
      });

      // Interactuar con el dropdown (en lugar de buscar directamente el login)
      const avatarButton = screen.getAllByRole('button').find(btn => 
        btn !== languageButton
      );
      fireEvent.click(avatarButton);

      // El idioma debe mantenerse
      expect(screen.getByText('Mission')).toBeInTheDocument();
    });

    test('Debe manejar hover states en tarjetas de testimonio', () => {
      renderWithRouter(<About />);

      const testimonialCards = screen.getAllByText(/maría gonzález|carlos rodríguez/i);
      
      testimonialCards.forEach(card => {
        // Simular hover
        fireEvent.mouseEnter(card.closest('.testimonial-card') || card);
        fireEvent.mouseLeave(card.closest('.testimonial-card') || card);
        
        // Verificar que el elemento sigue siendo accesible
        expect(card).toBeInTheDocument();
      });
    });
  });
});
