import { TestBed } from '@angular/core/testing';
import { UsersService } from './users-service'; // Asegura la ruta
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { vi } from 'vitest';
import { environment } from '../../../../../environments/environment';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  const API_URL = environment.API.IDENTITY_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- HELPER PARA LIMPIAR RUIDO ---
  // Esta función cancela las peticiones automáticas que no estamos testeando
  function ignoreExtraRequests() {
    httpMock.match(req => {
      return req.url.includes('/users') || req.url.includes('/users/patients');
    }).forEach(req => {
       if (!req.cancelled) req.flush([]); // Las respondemos con vacío para cerrarlas
    });
  }

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
    // Al crearse se disparan las peticiones automáticas, hay que cerrarlas
    TestBed.tick(); 
    ignoreExtraRequests();
  });

  it('usersResource debe obtener todos los usuarios', async () => {
    const mockUsers = [{ id: '1', name: 'Admin', role: 'ADMIN' }];

    expect(service.usersResource.value()).toBeUndefined();

    // Disparamos efectos (Salen AMBAS peticiones: users y patients)
    TestBed.tick();

    // 1. Atendemos la que nos interesa
    const req = httpMock.expectOne(`${API_URL}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    // 2. Cerramos la otra petición "ruidosa" (patients) que salió disparada
    httpMock.match(`${API_URL}/users/patients`).forEach(r => r.flush([]));

    await vi.waitFor(() => {
      expect(service.usersResource.value()).toEqual(mockUsers);
    });
  });

  it('patientsResource debe obtener solo los pacientes', async () => {
    const mockPatients = [{ id: '2', name: 'Paciente 1', role: 'PATIENT' }];

    TestBed.tick();

    // 1. Atendemos la que nos interesa
    const req = httpMock.expectOne(`${API_URL}/users/patients`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPatients);

    // 2. Cerramos la otra (users)
    httpMock.match(`${API_URL}/users`).forEach(r => r.flush([]));

    await vi.waitFor(() => {
      expect(service.patientsResource.value()).toEqual(mockPatients);
    });
  });

  it('getUserById debe obtener un usuario por ID', async () => {
    const mockUser = { id: '3', name: 'User 3' };
    const userId = 'user-123';

    const resource = TestBed.runInInjectionContext(() => {
      return service.getUserById(() => userId);
    });

    TestBed.tick();

    // 1. Atendemos la nuestra
    const req = httpMock.expectOne(`${API_URL}/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);

    // 2. Cerramos las automáticas que saltaron por instanciar el servicio
    ignoreExtraRequests();

    await vi.waitFor(() => {
      expect(resource.value()).toEqual(mockUser);
    });
  });

  it('getUserById NO debe hacer petición si el ID es undefined', async () => {
    const resource = TestBed.runInInjectionContext(() => {
      return service.getUserById(() => undefined);
    });

    TestBed.tick();

    // 1. Verificamos que NO salió la nuestra
    httpMock.expectNone(`${API_URL}/users/undefined`);
    
    // 2. Cerramos las automáticas
    ignoreExtraRequests();

    expect(resource.value()).toBeUndefined();
  });

  // --- TESTS DE PROMESAS (No generan requests automáticas extra al llamarse, pero al inicio sí) ---
  
  it('createUser debe enviar una petición POST', async () => {
    // IMPORTANTE: Al inyectar el servicio en beforeEach, ya salieron las GET automáticas.
    // Debemos limpiarlas antes de probar el POST para que verify() no falle.
    TestBed.tick(); 
    ignoreExtraRequests();

    const newUser: any = { name: 'New User' };
    const mockResponse: any = { id: '99', ...newUser };

    const promise = service.createUser(newUser);

    const req = httpMock.expectOne(`${API_URL}/users`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('updateUser debe enviar una petición PUT', async () => {
    TestBed.tick(); 
    ignoreExtraRequests();

    const id = 'user-123';
    const updateData: any = { name: 'Updated' };
    const mockResponse: any = { id, ...updateData };

    const promise = service.updateUser(id, updateData);

    const req = httpMock.expectOne(`${API_URL}/users/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);

    await promise;
  });

  it('deleteUser debe enviar una petición DELETE', async () => {
    TestBed.tick(); 
    ignoreExtraRequests();

    const id = 'user-999';
    const promise = service.deleteUser(id);

    const req = httpMock.expectOne(`${API_URL}/users/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    await promise;
  });
});