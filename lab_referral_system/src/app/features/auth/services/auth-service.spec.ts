import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service'; 
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment'; 
import { jwtDecode } from 'jwt-decode';

// 1. MOCKEAMOS LA LIBRERÍA EXTERNA (jwt-decode)
// Esto es vital: le decimos a Vitest que cuando el servicio llame a jwtDecode,
// use nuestra función espía en lugar de la real.
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn()
}));

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: any;

  // Datos simulados
  const mockToken = 'fake-jwt-token';
  const mockDecodedToken = { 
    userId: '123', 
    roles: 'ROLE_ADMIN', 
    labId: 'LAB-001',
    exp: 9999999999 // Futuro lejano
  };

  beforeEach(() => {
    // 2. Mock del Router (solo usamos navigate)
    routerMock = {
      navigate: vi.fn()
    };

    // 3. Mock de LocalStorage
    // Limpiamos y espiamos los métodos antes de cada test
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'removeItem');
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(), // Herramienta mágica para testear HTTP
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden peticiones HTTP pendientes
    vi.clearAllMocks();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // --- TESTS DE LOGIN (HTTP) ---
  
  it('login() debe hacer una petición POST y devolver la respuesta', async () => {
    const loginRequest = { email: 'test@duoc.cl', password: '123' };
    const mockResponse = { accessToken: 'token-recibido' };

    // Ejecutamos la promesa
    const promise = service.login(loginRequest);

    // Interceptamos la petición que el servicio acaba de lanzar
    const req = httpMock.expectOne(`${environment.API.IDENTITY_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);

    // "Flush" simula que el servidor respondió con éxito
    req.flush(mockResponse);

    // Verificamos el resultado
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  // --- TESTS DE LOCALSTORAGE ---

  it('setToken() debe guardar el token en localStorage', () => {
    service.setToken(mockToken);
    expect(localStorage.setItem).toHaveBeenCalledWith('AUTH_TOKEN', mockToken);
  });

  it('getToken() debe recuperar el token de localStorage', () => {
    (localStorage.getItem as any).mockReturnValue(mockToken);
    
    const token = service.getToken();
    
    expect(localStorage.getItem).toHaveBeenCalledWith('AUTH_TOKEN');
    expect(token).toBe(mockToken);
  });

  it('logout() debe eliminar el token y navegar al login', () => {
    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('AUTH_TOKEN');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  // --- TESTS DE JWT DECODE ---

  it('getUserIdFromToken() debe devolver el userId si el token es válido', () => {
    // Simulamos que hay token guardado
    (localStorage.getItem as any).mockReturnValue(mockToken);
    // Configuramos qué devuelve jwtDecode
    (jwtDecode as any).mockReturnValue(mockDecodedToken);

    const userId = service.getUserIdFromToken();

    expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    expect(userId).toBe('123');
  });

  it('getRoleFromToken() debe devolver el rol si el token es válido', () => {
    (localStorage.getItem as any).mockReturnValue(mockToken);
    (jwtDecode as any).mockReturnValue(mockDecodedToken);

    const role = service.getRoleFromToken();

    expect(role).toBe('ROLE_ADMIN');
  });

  it('getLabFromToken() debe devolver el labId si el token es válido', () => {
    (localStorage.getItem as any).mockReturnValue(mockToken);
    (jwtDecode as any).mockReturnValue(mockDecodedToken);

    const lab = service.getLabFromToken();

    expect(lab).toBe('LAB-001');
  });

  it('debe devolver null en los getters si no hay token o jwtDecode falla', () => {
    // Caso 1: No hay token
    (localStorage.getItem as any).mockReturnValue(null);
    expect(service.getUserIdFromToken()).toBeNull();

    // Caso 2: Hay token pero jwtDecode falla (token corrupto)
    (localStorage.getItem as any).mockReturnValue('token-invalido');
    (jwtDecode as any).mockImplementation(() => { throw new Error('Invalid token'); });
    
    // Capturamos el console.error para que no ensucie la salida del test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(service.getRoleFromToken()).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });

  // --- TEST DE VALIDACIÓN ---

  it('validateToken() debe devolver TRUE si el token NO ha expirado', () => {
    (localStorage.getItem as any).mockReturnValue(mockToken);
    
    // Configuramos una fecha de expiración en el futuro (tiempo actual + 1 hora)
    const futureExp = (Date.now() / 1000) + 3600; 
    (jwtDecode as any).mockReturnValue({ ...mockDecodedToken, exp: futureExp });

    const isValid = service.validateToken();

    expect(isValid).toBe(true);
  });

  it('validateToken() debe devolver FALSE si el token HA expirado', () => {
    (localStorage.getItem as any).mockReturnValue(mockToken);
    
    // Configuramos una fecha de expiración en el pasado (tiempo actual - 1 hora)
    const pastExp = (Date.now() / 1000) - 3600; 
    (jwtDecode as any).mockReturnValue({ ...mockDecodedToken, exp: pastExp });

    const isValid = service.validateToken();

    expect(isValid).toBe(false);
  });
});