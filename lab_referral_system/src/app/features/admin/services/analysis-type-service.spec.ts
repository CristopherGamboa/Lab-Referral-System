import { TestBed } from '@angular/core/testing';
import { AnalysisTypeService } from './analysis-type-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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

  it('analysisTypeResource debe realizar una petición GET y actualizar los datos', () => {
    const mockAnalysisTypes = [
      { id: '1', name: 'Hemograma Completo', description: 'Análisis de sangre' },
      { id: '2', name: 'Perfil Lipídico', description: 'Colesterol y triglicéridos' }
    ];

    // 1. Verificamos estado inicial
    expect(service.analysisTypeResource.value()).toBeUndefined();

    // 2. Esperamos la petición a la URL correcta
    const req = httpMock.expectOne(`${environment.API.REFERRAL_URL}/catalog/analysis`);
    expect(req.request.method).toBe('GET');

    // 3. Devolvemos los datos simulados
    req.flush(mockAnalysisTypes);

    // 4. Verificamos que la señal tenga los datos
    expect(service.analysisTypeResource.value()).toEqual(mockAnalysisTypes);
  });

  it('debe manejar errores en la petición', () => {
    const req = httpMock.expectOne(`${environment.API.REFERRAL_URL}/catalog/analysis`);

    // Simulamos error 404 Not Found
    req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });

    // Verificamos que la señal de error esté activa
    expect(service.analysisTypeResource.error()).toBeTruthy();
  });
});