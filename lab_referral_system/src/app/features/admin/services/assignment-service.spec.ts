import { TestBed } from '@angular/core/testing';
import { AssignmentService } from './assignment-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

describe('AssignmentService', () => {
  let service: AssignmentService;
  let httpMock: HttpTestingController;

  const API_URL = environment.API.REFERRAL_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssignmentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AssignmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // --- TESTS DE httpResource (Consultas) ---

  it('assignmentsResource debe obtener todas las asignaciones', () => {
    const mockResponse = [{ id: '1', status: 'PENDING' }];

    // 1. Inicia undefined
    expect(service.assignmentsResource.value()).toBeUndefined();

    // 2. Interceptamos
    const req = httpMock.expectOne(`${API_URL}/assignments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    // 3. Verifica actualización
    expect(service.assignmentsResource.value()).toEqual(mockResponse);
  });

  it('getAssignmentsByLabId debe obtener asignaciones filtradas por Lab ID', () => {
    const mockResponse = [{ id: '2', status: 'COMPLETED' }];
    const labId = 'lab-123';

    // Pasamos una función señal que devuelve un ID
    const resource = service.getAssignmentsByLabId(() => labId);

    const req = httpMock.expectOne(`${API_URL}/assignments/lab/${labId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(resource.value()).toEqual(mockResponse);
  });

  it('getAssignmentsByLabId NO debe hacer petición si el ID es undefined', () => {
    // Pasamos una función que devuelve undefined
    const resource = service.getAssignmentsByLabId(() => undefined);

    // Verificamos que no haya peticiones pendientes
    httpMock.expectNone(`${API_URL}/assignments/lab/undefined`);
    expect(resource.value()).toBeUndefined();
  });

  it('getAssigmentById debe obtener una asignación específica', () => {
    const mockResponse = { id: '3', status: 'IN_PROGRESS' };
    const assignmentId = 'assign-999';

    const resource = service.getAssigmentById(() => assignmentId);

    const req = httpMock.expectOne(`${API_URL}/assignments/${assignmentId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(resource.value()).toEqual(mockResponse);
  });

  // --- TESTS DE PROMESAS (Mutaciones) ---

  it('createAssignment debe enviar una petición POST', async () => {
    const newAssignment: any = { patientId: 'p1', labId: 'l1' };
    const mockResponse: any = { id: '100', ...newAssignment };

    // Ejecutamos la promesa
    const promise = service.createAssignment(newAssignment);

    // Interceptamos
    const req = httpMock.expectOne(`${API_URL}/assignments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAssignment);
    
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('updateAssignment debe enviar una petición PUT', async () => {
    const id = '100';
    const updateData: any = { status: 'UPDATED' };
    const mockResponse: any = { id, ...updateData };

    const promise = service.updateAssignment(id, updateData);

    const req = httpMock.expectOne(`${API_URL}/assignments/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);

    req.flush(mockResponse);
    await promise;
  });

  it('updateAssignmentStatusToComplete debe enviar PUT con query param y body vacío', async () => {
    const id = '200';
    const mockResponse: any = { id, status: 'COMPLETED' };

    const promise = service.updateAssignmentStatusToComplete(id);

    // Ojo aquí: la URL incluye el query param
    const req = httpMock.expectOne(`${API_URL}/assignments/${id}/status?status=COMPLETED`);
    expect(req.request.method).toBe('PUT');
    // Verificamos que enviaste un objeto vacío como body ({})
    expect(req.request.body).toEqual({});

    req.flush(mockResponse);
    
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('deleteAssignment debe enviar una petición DELETE', async () => {
    const id = '300';

    const promise = service.deleteAssignment(id);

    const req = httpMock.expectOne(`${API_URL}/assignments/${id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null); // DELETE suele devolver null o void
    await promise;
  });
});