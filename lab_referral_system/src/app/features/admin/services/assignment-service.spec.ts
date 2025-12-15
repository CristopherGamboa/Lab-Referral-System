import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EnvironmentInjector, runInInjectionContext, signal } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { AssignmentService } from './assignment-service';
import { environment } from '../../../../environments/environment';
import { AssignmentResponse } from '../interfaces/assigment-response';
import { CreateAssignmentData } from '../assignments/interfaces/create-assignment-data';

describe('AssignmentService', () => {
  let service: AssignmentService;
  let httpMock: HttpTestingController;
  
  // Centralizamos la URL base para evitar strings mágicos en los tests
  const API_URL = environment.API.REFERRAL_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssignmentService,
        provideHttpClient(),
        provideHttpClientTesting(), // Crucial para mockear requests
      ],
    });

    service = TestBed.inject(AssignmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no queden requests pendientes
  });

  // describe('Core Resource: assignmentsResource', () => {
  //   // it('should fetch all assignments via httpResource', () => {
  //   //   const mockAssignments: AssignmentResponse[] = [
  //   //     { id: '1', title: 'Test 1' } as any,
  //   //     { id: '2', title: 'Test 2' } as any
  //   //   ];

  //   //   // Accedemos al valor para "activar" el recurso (lazy evaluation)
  //   //   // En Angular 21, leer .value() dispara el fetch si no ha ocurrido
  //   //   const resource = service.assignmentsResource;
      
  //   //   // Forzamos lectura (en un componente esto lo hace el template)
  //   //   expect(resource.value()).toBeUndefined(); // Inicialmente undefined mientras carga

  //   //   const req = httpMock.expectOne(`${API_URL}/assignments`);
  //   //   expect(req.request.method).toBe('GET');

  //   //   req.flush(mockAssignments);

  //   //   // Verificamos que el signal se actualizó
  //   //   expect(resource.value()).toEqual(mockAssignments);
  //   // });
  // });

  describe('Computed Resources', () => {
    // it('should fetch assignments by Lab ID when signal has value', () => {
    //   const labId = signal<string | undefined>(undefined);

    //   const injector = TestBed.inject(EnvironmentInjector);

    //   runInInjectionContext(injector, () => {
    //     const mockAssignments: AssignmentResponse[] = [
    //       { 
    //       id: 'inv-999', 
    //       title: 'Single',
    //       status: 'PENDING',
    //       analysisId: 'analysis-1',
    //       analysisName: 'Analysis 1',
    //       appointmentDate: new Date(),
    //       labId: 'lab-1',
    //       labName: 'Lab 1',
    //       patientUserId: 'patient-1',
    //       requestDate: new Date()
    //     } as AssignmentResponse];

    //     const resource = service.getAssignmentsByLabId(labId);

    //     TestBed.tick(); 
    //     expect(resource.value()).toBeUndefined();
    //     httpMock.expectNone(`${API_URL}/assignments/lab/undefined`);

    //     labId.set('lab-123');
    //     TestBed.tick(); 

    //     const currentValue = resource.value(); 

    //     const req = httpMock.expectOne(`${API_URL}/assignments/lab/lab-123`);
    //     expect(req.request.method).toBe('GET');
        
    //     req.flush(mockAssignments);
        
    //     expect(resource.value()).toEqual(mockAssignments);
    //   });      
    // });

    it('should NOT fetch assignments by Lab ID if signal returns undefined', () => {
      const labId = signal<string | undefined>(undefined);      
      const injector = TestBed.inject(EnvironmentInjector);

      runInInjectionContext(injector, () => {
        const resource = service.getAssignmentsByLabId(labId);

        const val = resource.value();
      
        httpMock.expectNone((req) => req.url.includes('/assignments/lab'));
      });      
    });

    // it('should fetch specific assignment by ID', () => {
    //   const assignmentId = signal<string>('inv-999');
    //   const mockAssignment: AssignmentResponse = { 
    //     id: 'inv-999', 
    //     title: 'Single',
    //     status: 'PENDING',
    //     analysisId: 'analysis-1',
    //     analysisName: 'Analysis 1',
    //     appointmentDate: new Date(),
    //     labId: 'lab-1',
    //     labName: 'Lab 1',
    //     patientUserId: 'patient-1',
    //     requestDate: new Date()
    //   } as AssignmentResponse;

    //   const injector = TestBed.inject(EnvironmentInjector);

    //   runInInjectionContext(injector, () => {
    //     const resource = service.getAssigmentById(assignmentId);

    //     const req = httpMock.expectOne(`${API_URL}/assignments/inv-999`);
    //     expect(req.request.method).toBe('GET');
        
    //     req.flush(mockAssignment);

    //     expect(resource.value()).toEqual(mockAssignment);
    //   });
    // });
  });

  describe('Mutations (Promise-based)', () => {
    it('should create an assignment via POST', async () => {
      const payload: CreateAssignmentData = { title: 'New Work' } as any;
      const response: AssignmentResponse = { id: 'new-1', ...payload } as any;

      // Iniciamos la promesa
      const promise = service.createAssignment(payload);

      const req = httpMock.expectOne(`${API_URL}/assignments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);

      req.flush(response);

      // Esperamos resolución
      const result = await promise;
      expect(result).toEqual(response);
    });

    it('should update an assignment via PUT', async () => {
      const id = 'update-1';
      const payload: CreateAssignmentData = { title: 'Updated' } as any;
      const response: AssignmentResponse = { id, ...payload } as any;

      const promise = service.updateAssignment(id, payload);

      const req = httpMock.expectOne(`${API_URL}/assignments/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);

      req.flush(response);
      expect(await promise).toEqual(response);
    });

    it('should update status to COMPLETED', async () => {
      const id = 'status-1';
      const response: AssignmentResponse = { id, status: 'COMPLETED' } as any;

      const promise = service.updateAssignmentStatusToComplete(id);

      // Verificamos URL y query params
      const req = httpMock.expectOne(`${API_URL}/assignments/${id}/status?status=COMPLETED`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({}); // Body vacío según tu servicio

      req.flush(response);
      expect(await promise).toEqual(response);
    });

    it('should delete an assignment', async () => {
      const id = 'del-1';

      const promise = service.deleteAssignment(id);

      const req = httpMock.expectOne(`${API_URL}/assignments/${id}`);
      expect(req.request.method).toBe('DELETE');

      req.flush(null); // DELETE suele devolver 204 No Content (null o body vacío)
      
      await expect(promise).resolves.toBeNull(); // O undefined dependiendo de la implementación interna de HttpClient
    });
  });
});