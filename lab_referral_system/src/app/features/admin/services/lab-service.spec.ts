import { TestBed } from '@angular/core/testing';
import { LabService } from './lab-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

// Importamos 'vi' de vitest para usar waitFor
import { vi } from 'vitest';

describe('LabService', () => {
  let service: LabService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LabService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LabService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // NOTA: El test debe ser 'async' ahora
  it('labResource debe hacer una petición GET y actualizar su valor', async () => {
    const mockLabsResponse = [
      { id: '1', name: 'Laboratorio Central', address: 'Calle Falsa 123' },
      { id: '2', name: 'BioLab', address: 'Avenida Siempre Viva 742' }
    ];

    // 1. Trigger: Leemos el signal para que el Effect interno se active
    expect(service.labResource.value()).toBeUndefined();

    // 2. Zoneless: Forzamos que los efectos pendientes (la petición HTTP) se lancen
    TestBed.tick();

    // 3. Interceptamos y respondemos
    const req = httpMock.expectOne(`${environment.API.REFERRAL_URL}/catalog/laboratories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLabsResponse);

    // 4. LA SOLUCIÓN ZONELESS:
    // No usamos tick(). Usamos vi.waitFor().
    // Esto espera a que la microtask del httpResource termine y actualice el signal.
    await vi.waitFor(() => {
      // Vitest reintentará esta línea hasta que deje de fallar o haga timeout
      expect(service.labResource.value()).toEqual(mockLabsResponse);
    });
  });

  it('debe manejar errores correctamente', async () => {
    // 1. Trigger
    const unused = service.labResource.value();
    
    // 2. Forzar petición
    TestBed.tick();

    // 3. Responder con error
    const req = httpMock.expectOne(`${environment.API.REFERRAL_URL}/catalog/laboratories`);
    const mockError = new ProgressEvent('error');
    req.error(mockError, { status: 500, statusText: 'Server Error' });

    // 4. Esperar a que el signal de error se actualice
    await vi.waitFor(() => {
       expect(service.labResource.error()).toBeTruthy();
    });
  });
});