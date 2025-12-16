import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisResultForm } from './analysis-result-form';
import { AuthService } from '../../../../auth/services/auth-service';
import { AssignmentService } from '../../../../admin/services/assignment-service';
import { AnalysisResultService } from '../../services/analysis-result-service';
import { Router, provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signal } from '@angular/core';

describe('AnalysisResultForm', () => {
  let component: AnalysisResultForm;
  let fixture: ComponentFixture<AnalysisResultForm>;
  
  let authServiceMock: any;
  let assignmentServiceMock: any;
  let analysisResultServiceMock: any;
  let routerMock: any;

  // Signals de control
  let resourceValueSignal: any;
  let globalLoadingSignal: any;

  const createMockResource = (data: any = null) => ({
    value: signal(data),
    isLoading: signal(false),
    error: signal(null),
    reload: vi.fn()
  });

  const mockAssignment = {
    id: 'assign-1',
    analysisName: 'Hemograma',
    patientUserId: 'patient-1'
  };

  const mockFormData = {
    analysisDate: '2025-01-01',
    analysisType: 'Hemograma',
    assignmentId: 'assign-1',
    notes: 'Todo ok',
    patientId: 'patient-1',
    result: 'Positivo',
    technicianId: 'tech-1'
  };

  beforeEach(async () => {
    resourceValueSignal = signal(null);
    globalLoadingSignal = signal(false);

    authServiceMock = {
      getUserIdFromToken: vi.fn().mockReturnValue('tech-1')
    };

    assignmentServiceMock = {
      // Mock para la lógica del componente (Single)
      getAssigmentById: vi.fn().mockReturnValue({
        value: resourceValueSignal,
        isLoading: signal(false),
        error: signal(null),
        reload: vi.fn()
      }),
      // Mock para el HTML línea 1 (Plural/Global)
      assignmentsResource: {
        isLoading: globalLoadingSignal
      },
      updateAssignmentStatusToComplete: vi.fn().mockResolvedValue({ success: true })
    };

    analysisResultServiceMock = {
      createAnalysisResult: vi.fn().mockResolvedValue({ success: true })
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AnalysisResultForm],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AssignmentService, useValue: assignmentServiceMock },
        { provide: AnalysisResultService, useValue: analysisResultServiceMock },
        { provide: Router, useValue: routerMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisResultForm);
    component = fixture.componentInstance;
    
    // Seteamos el input requerido
    fixture.componentRef.setInput('assignmentId', 'assign-1');
    
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con datos cuando carga la asignación (LinkedSignal)', async () => {
    // Simulamos que llega la data del backend
    resourceValueSignal.set(mockAssignment);
    
    fixture.detectChanges();
    await fixture.whenStable();

    const formValue = component['form']().value();
    
    expect(formValue.assignmentId).toBe('assign-1');
    expect(formValue.analysisType).toBe('Hemograma');
    expect(formValue.patientId).toBe('patient-1');
    expect(formValue.technicianId).toBe('tech-1'); // Viene del AuthService
  });

  it('debería bloquear el envío si el formulario es inválido', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    
    // Formulario vacío por defecto -> inválido
    await component.sendRequest(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(analysisResultServiceMock.createAnalysisResult).not.toHaveBeenCalled();
  });

  it('debería procesar el envío exitoso (Crear Resultado + Actualizar Estado)', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    
    // Hack para simular formulario válido
    const formMock = { valid: () => true, value: () => mockFormData };
    // @ts-ignore
    component.form = () => formMock;

    await component.sendRequest(event);

    // 1. Debe crear el resultado
    expect(analysisResultServiceMock.createAnalysisResult).toHaveBeenCalledWith(mockFormData);
    // 2. Debe cerrar la asignación
    expect(assignmentServiceMock.updateAssignmentStatusToComplete).toHaveBeenCalledWith('assign-1');
    // 3. Debe navegar
    expect(routerMock.navigate).toHaveBeenCalledWith(['/technician/assignments']);
    expect(window.alert).toHaveBeenCalled();
  });

  it('debería manejar errores al crear el análisis', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    const formMock = { valid: () => true, value: () => mockFormData };
    // @ts-ignore
    component.form = () => formMock;

    analysisResultServiceMock.createAnalysisResult.mockRejectedValue(new Error('API Error'));

    await component.sendRequest(event);

    expect(component.errorMessage()).toContain('Ocurrió un error al crear');
    expect(assignmentServiceMock.updateAssignmentStatusToComplete).not.toHaveBeenCalled(); // Se detiene antes
  });

  it('debería manejar errores al actualizar el estado de la asignación', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    const formMock = { valid: () => true, value: () => mockFormData };
    // @ts-ignore
    component.form = () => formMock;

    // El primero pasa, el segundo falla
    analysisResultServiceMock.createAnalysisResult.mockResolvedValue({});
    assignmentServiceMock.updateAssignmentStatusToComplete.mockRejectedValue(new Error('Update Error'));

    await component.sendRequest(event);

    expect(component.errorMessage()).toContain('Ocurrió un error al actualizar');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});