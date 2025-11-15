// src/contexts/__tests__/AuthContext.test.jsx
import { test, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock de localStorage y sessionStorage
const createMockStorage = () => {
  const store = new Map();
  return {
    getItem: vi.fn((key) => store.get(key) || null),
    setItem: vi.fn((key, value) => store.set(key, value)),
    removeItem: vi.fn((key) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
  };
};

describe('AuthContext', () => {
  let mockLocalStorage;
  let mockSessionStorage;
  let originalFetch;

  beforeEach(() => {
    // Configura mocks de storage
    mockLocalStorage = createMockStorage();
    mockSessionStorage = createMockStorage();
    
    global.localStorage = mockLocalStorage;
    global.sessionStorage = mockSessionStorage;

    // Mock de fetch
    originalFetch = global.fetch;
    global.fetch = vi.fn();

    // Mock de console.error para evitar logs en tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    mockSessionStorage.clear();
    global.fetch = originalFetch;
  });

  describe('Initialization', () => {
    test('provides auth context to children', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('token');
    });

    test('throws error when useAuth is used outside AuthProvider', () => {
      // Suprime el error esperado en la consola
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleError.mockRestore();
    });

    test('starts with user not authenticated', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    test('restores session from localStorage on mount', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', role: 'admin' };
      const mockToken = 'fake-jwt-token';

      mockLocalStorage.setItem('user', JSON.stringify(mockUser));
      mockLocalStorage.setItem('token', mockToken);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.token).toBe(mockToken);
      });
    });

    test('restores session from sessionStorage if localStorage is empty', async () => {
      const mockUser = { id: 2, name: 'Session User', email: 'session@example.com', role: 'padre' };
      const mockToken = 'session-jwt-token';

      mockSessionStorage.setItem('user', JSON.stringify(mockUser));
      mockSessionStorage.setItem('token', mockToken);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.token).toBe(mockToken);
      });
    });
  });

  describe('Login functionality', () => {
    test('successfully logs in user with rememberMe=true', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', role: 'admin' };
      const mockToken = 'fake-jwt-token';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: mockToken,
          user: mockUser,
        }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123', true);
      });

      expect(loginResult.ok).toBe(true);
      expect(loginResult.data.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);

      // Verifica que se guardó en localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    test('successfully logs in user with rememberMe=false', async () => {
      const mockUser = { id: 2, name: 'Temp User', email: 'temp@example.com', role: 'estudiante' };
      const mockToken = 'temp-jwt-token';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: mockToken,
          user: mockUser,
        }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('temp@example.com', 'password123', false);
      });

      expect(loginResult.ok).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);

      // Verifica que se guardó en sessionStorage
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    test('handles login failure with error message', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Invalid credentials',
        }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('wrong@example.com', 'wrongpassword');
      });

      expect(loginResult.ok).toBe(false);
      expect(loginResult.error).toBeDefined();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    test('handles network error during login', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123');
      });

      expect(loginResult.ok).toBe(false);
      expect(loginResult.error).toContain('Network error');
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Logout functionality', () => {
    test('clears authentication state on logout', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', role: 'admin' };
      const mockToken = 'fake-jwt-token';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: mockToken,
          user: mockUser,
        }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Login primero
      await act(async () => {
        await result.current.login('test@example.com', 'password123', true);
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Logout
      await act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    test('removes data from both localStorage and sessionStorage on logout', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', role: 'admin' };
      const mockToken = 'fake-jwt-token';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: mockToken,
          user: mockUser,
        }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.login('test@example.com', 'password123', true);
      });

      await act(() => {
        result.current.logout();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('Language management', () => {
    test('starts with default language (es)', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.lang).toBe('es');
    });

    test('changes language and persists to localStorage', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(() => {
        result.current.setLang('en');
      });

      expect(result.current.lang).toBe('en');
      
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('lang', 'en');
      });
    });
  });

  describe('Active student management', () => {
    test('starts with no active student', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.activeStudent).toBeNull();
    });

    test('can set active student', async () => {
      const mockStudent = { id: 10, name: 'Student Name' };

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(() => {
        result.current.setActiveStudent(mockStudent);
      });

      expect(result.current.activeStudent).toEqual(mockStudent);
    });

    test('clears active student on logout', async () => {
      const mockUser = { id: 1, name: 'Parent User', email: 'parent@example.com', role: 'padre' };
      const mockToken = 'fake-jwt-token';
      const mockStudent = { id: 10, name: 'Student Name' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: mockToken,
          user: mockUser,
        }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.login('parent@example.com', 'password123', true);
        result.current.setActiveStudent(mockStudent);
      });

      expect(result.current.activeStudent).toEqual(mockStudent);

      await act(() => {
        result.current.logout();
      });

      expect(result.current.activeStudent).toBeNull();
    });
  });

  describe('Loading state', () => {
    test('starts with loading=true and becomes false after initialization', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Inicialmente puede estar en true
      // Espera a que loading se vuelva false
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});
