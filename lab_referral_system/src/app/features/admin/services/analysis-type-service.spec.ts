import { TestBed } from '@angular/core/testing';
import { AnalysisTypeService } from './analysis-type-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { vi } from 'vitest'; // Importamos vi para usar waitFor

describe('AnalysisTypeService', () => {
  let service: AnalysisTypeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalysisTypeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AnalysisTypeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // Hacemos el test async para poder esperar (await)
  it('analysisTypeResource debe realizar una petición GET y actualizar los datos', async () => {
    const mockAnalysisTypes = [
      { id: '1', name: 'Hemograma Completo', description: 'Análisis de sangre' },
      { id: '2', name: 'Perfil Lipídico', description: 'Colesterol y triglicéridos' }
    ];

    // 1. Trigger: Leemos el valor para despertar al resource (Lazy signal)
    expect(service.analysisTypeResource.value()).toBeUndefined();

    // 2. Forzamos la ejecución del efecto pendiente que hace la petición HTTP
    TestBed.tick();

    // 3. Ahora sí, interceptamos la petición
    const req = httpMock.expectOne(`${environment.API.REFERRAL_URL}/catalog/analysis`);
    expect(req.request.method).toBe('GET');

    // 4. Respondemos con datos simulados
    req.flush(mockAnalysisTypes);

    // 5. Usamos waitFor para esperar a que el Signal procese la respuesta de forma asíncrona
    await vi.waitFor(() => {
      expect(service.analysisTypeResource.value()).toEqual(mockAnalysisTypes);
    });
  });

  it('debe manejar errores en la petición', async () => {
    // 1. Trigger de lectura
    const unused = service.analysisTypeResource.value(); 
    
    // 2. Forzamos salida de petición
    TestBed.tick();

    const req = httpMock.expectOne(`${environment.API.REFERRAL_URL}/catalog/analysis`);

    // 3. Simulamos error 404
    req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });

    // 4. Esperamos a que el signal de error se active
    await vi.waitFor(() => {
      expect(service.analysisTypeResource.error()).toBeTruthy();
    });
  });
});