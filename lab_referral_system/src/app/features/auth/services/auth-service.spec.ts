import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { jwtDecode } from 'jwt-decode'; // Importamos para tipado, pero será mockeado
import { LoginData } from '../interfaces/login-data';
import { LoginResponse } from '../interfaces/login-response';

// 1. Mock de la librería externa 'jwt-decode'
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: { navigate: Mock };
  
  // Mock del LocalStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: vi.fn((key: string) => { delete store[key]; }),
      clear: vi.fn(() => { store = {}; }),
    };
  })();

  beforeEach(() => {
    // 2. Configuración del Mock del Router
    routerSpy = { navigate: vi.fn() };

    // 3. Interceptar window.localStorage
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear(); // Limpiar estado entre tests

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(), // API moderna de testing HTTP
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden peticiones pendientes
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- PRUEBAS DE LOGIN (HTTP) ---
  describe('login()', () => {
    it('should send a POST request and return the response', async () => {
      const mockRequest: LoginData = { email: 'test@test.com', password: '123' };
      const mockResponse: LoginResponse = { accessToken: 'fake-jwt-token', 
                                            userId: 'user-123', 
                                            email: 'test@test.com', 
                                            roles: ['User']};

      // Iniciamos la promesa
      const loginPromise = service.login(mockRequest);

      // Interceptamos la petición pendiente
      const req = httpMock.expectOne(`${environment.API.IDENTITY_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);

      // Resolvemos la petición (flush)
      req.flush(mockResponse);

      // Esperamos el resultado de la promesa
      const result = await loginPromise;
      expect(result).toEqual(mockResponse);
    });
  });

  // --- PRUEBAS DE LOCALSTORAGE ---
  describe('Token Management', () => {
    it('should set token in localStorage', () => {
      service.setToken('abc-123');
      expect(localStorage.setItem).toHaveBeenCalledWith('AUTH_TOKEN', 'abc-123');
    });

    it('should get token from localStorage', () => {
      localStorage.setItem('AUTH_TOKEN', 'xyz-789');
      expect(service.getToken()).toBe('xyz-789');
    });
  });

  // --- PRUEBAS DE JWT DECODE ---
  describe('Token Decoding', () => {
    const mockToken = 'mock.jwt.token';

    beforeEach(() => {
      // Pre-configurar que existe un token
      vi.spyOn(service, 'getToken').mockReturnValue(mockToken);
    });

    it('should return userId from token', () => {
      const mockPayload = { userId: 'user-123', roles: 'Admin', labId: 'lab-1' };
      (jwtDecode as Mock).mockReturnValue(mockPayload);

      const userId = service.getUserIdFromToken();
      
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
      expect(userId).toBe('user-123');
    });

    it('should return null if decoding throws an error', () => {
      // Simulamos un error (ej. token malformado)
      (jwtDecode as Mock).mockImplementation(() => { throw new Error('Invalid token'); });
      
      // Espiamos console.error para que no ensucie la salida del test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(service.getUserIdFromToken()).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should return correct role and labId', () => {
      const mockPayload = { userId: 'u1', roles: 'SuperAdmin', labId: 'Laboratory-X' };
      (jwtDecode as Mock).mockReturnValue(mockPayload);

      expect(service.getRoleFromToken()).toBe('SuperAdmin');
      expect(service.getLabFromToken()).toBe('Laboratory-X');
    });
  });

  // --- PRUEBAS DE VALIDACIÓN ---
  describe('validateToken()', () => {
    const mockToken = 'valid.token';

    beforeEach(() => {
      vi.spyOn(service, 'getToken').mockReturnValue(mockToken);
    });

    it('should return true if token is NOT expired', () => {
      // Expiración en el futuro (Date.now() + 1 hora)
      const futureExp = (Date.now() / 1000) + 3600;
      (jwtDecode as Mock).mockReturnValue({ exp: futureExp });

      expect(service.validateToken()).toBe(true);
    });

    it('should return false if token IS expired', () => {
      // Expiración en el pasado
      const pastExp = (Date.now() / 1000) - 3600;
      (jwtDecode as Mock).mockReturnValue({ exp: pastExp });

      expect(service.validateToken()).toBe(false);
    });
    
    it('should return false if decoding fails', () => {
       (jwtDecode as Mock).mockImplementation(() => { throw new Error(); });
       expect(service.validateToken()).toBe(false);
    });
  });

  // --- PRUEBAS DE LOGOUT ---
  describe('logout()', () => {
    it('should remove token and navigate to login', () => {
      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('AUTH_TOKEN');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});