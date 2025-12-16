import { TestBed } from '@angular/core/testing';
import { AnalysisResultService } from './analysis-result-service'; 
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EnvironmentInjector, runInInjectionContext, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment'; 
import { CreateAnalysisResult } from '../interfaces/create-analysis-result';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AnalysisResultService', () => {
  let service: AnalysisResultService;
  let httpMock: HttpTestingController;
  let injector: EnvironmentInjector;

  const API_URL = environment.API.ANALYSIS_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalysisResultService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AnalysisResultService);
    httpMock = TestBed.inject(HttpTestingController);
    injector = TestBed.inject(EnvironmentInjector);
  });

  afterEach(() => {
    // Verifica que no queden peticiones pendientes
    httpMock.verify();
  });

  describe('createAnalysisResult (Promise)', () => {
    it('debería enviar una petición POST y retornar la respuesta', async () => {
      // Arrange
      const mockRequest: CreateAnalysisResult = { 
        assignmentId: 'assign-1', 
        resultData: 'Positive' 
      } as any;
      
      const mockResponse = { id: 'res-1', ...mockRequest };

      // Act
      const promise = service.createAnalysisResult(mockRequest);

      // Assert: Interceptamos la petición pendiente
      const req = httpMock.expectOne(`${API_URL}/analysis-results`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);

      // Resolvemos la petición
      req.flush(mockResponse);

      // Verificamos el resultado de la promesa
      const result = await promise;
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAnalysisById (Resource)', () => {
    it('NO debería hacer fetch si la signal es undefined (Lazy Loading)', () => {
      runInInjectionContext(injector, () => {
        // Arrange
        const idSignal = signal<string | undefined>(undefined);

        // Act
        const resource = service.getAnalysisById(idSignal);
        
        TestBed.tick(); // Incluso aquí es buena práctica limpiar

        // Assert
        httpMock.expectNone(`${API_URL}/analysis-results/undefined`);
        httpMock.expectNone((req) => req.url.includes('/analysis-results/'));
        TestBed.tick();
        expect(resource.value()).toBeUndefined();
      });
    });
  });
});