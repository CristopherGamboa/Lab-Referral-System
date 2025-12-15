import { TestBed } from '@angular/core/testing';
import { LabService } from './lab-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'; // Ajusta la ruta si es necesario

describe('LabService', () => {
  let service: LabService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LabService,
        // Proveedores necesarios para probar peticiones HTTP modernas
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });

    service = TestBed.inject(LabService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no queden peticiones pendientes o inesperadas
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('labResource debe hacer una petición GET y actualizar su valor', () => {
    // Datos simulados que esperamos recibir del backend
    const mockLabsResponse = [
      { id: '1', name: 'Laboratorio Central', address: 'Calle Falsa 123' },
      { id: '2', name: 'BioLab', address: 'Avenida Siempre Viva 742' }
    ];

    // 1. Accedemos al recurso. 
    // Al ser un httpResource, la petición suele dispararse al instanciarse o al leerse por primera vez.
    // Verificamos el estado inicial (debería ser undefined o loading antes de la respuesta)
    expect(service.labResource.value()).toBeUndefined(); 

    // 2. Interceptamos la petición HTTP generada automáticamente por httpResource
    const req = httpMock.expectOne(`${environment.API.REFERRAL_URL}/catalog/laboratories`);
    
    // 3. Verificamos que sea el método correcto
    expect(req.request.method).toBe('GET');

    // 4. Simulamos la respuesta del servidor ("Flush")
    req.flush(mockLabsResponse);

    // 5. Verificamos que la señal (Signal) del recurso se haya actualizado con los datos
    // En Angular moderno, la actualización de la señal tras el flush es síncrona en tests
    expect(service.labResource.value()).toEqual(mockLabsResponse);
  });

  it('debe manejar errores correctamente', () => {
    // 1. Esperamos la llamada
    const req = httpMock.expectOne(`${environment.API.REFERRAL_URL}/catalog/laboratories`);

    // 2. Simulamos un error de red o servidor (ej: 500 Internal Server Error)
    const mockError = new ProgressEvent('error');
    req.error(mockError, { status: 500, statusText: 'Server Error' });

    // 3. Verificamos el estado de error del recurso
    // httpResource expone una propiedad .error() que contiene el error si falla
    expect(service.labResource.error()).toBeTruthy();
    expect(service.labResource.value()).toBeUndefined(); // El valor debe seguir undefined (o lo que tuviera antes)
  });
});