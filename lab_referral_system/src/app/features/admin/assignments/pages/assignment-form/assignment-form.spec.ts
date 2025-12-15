import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentForm } from './assignment-form';
import { AssignmentService } from '../../../services/assignment-service';
import { LabService } from '../../../services/lab-service';
import { UsersService } from '../../../users/services/users-service';
import { AnalysisTypeService } from '../../../services/analysis-type-service';
import { Router, provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signal } from '@angular/core';

describe('AssignmentForm', () => {
  let component: AssignmentForm;
  let fixture: ComponentFixture<AssignmentForm>;
  
  // Mocks
  let assignmentServiceMock: any;
  let labServiceMock: any;
  let usersServiceMock: any;
  let analysisTypeServiceMock: any;
  let routerMock: any;
  
  // Signal para controlar la respuesta del "GetById"
  let resourceValueSignal: any;

  // --- HELPER PARA CREAR RECURSOS ---
  const createMockResource = (data: any[] = []) => ({
    value: signal(data),       // Para .value() en el HTML
    isLoading: signal(false),  // Para .isLoading() en el HTML
    error: signal(null),
    reload: vi.fn()
  });

  const mockAssignmentData = {
    analysisId: 'ana-1',
    labId: 'lab-1',
    appointmentDate: new Date('2025-01-01'),
    patientUserId: 'user-1',
    status: 'SCHEDULED'
  };

  beforeEach(async () => {
    resourceValueSignal = signal(null);

    // 1. Assignment Service Mock
    assignmentServiceMock = {
      // Para: assignmentResource = this.assignmentService.getAssigmentById(...)
      getAssigmentById: vi.fn().mockReturnValue({
        value: resourceValueSignal,
        reload: vi.fn(),
        isLoading: signal(false), // Importante para que no falle la lógica interna
        error: signal(null)
      }),
      createAssignment: vi.fn().mockResolvedValue({ success: true }),
      updateAssignment: vi.fn().mockResolvedValue({ success: true }),
      
      // Para HTML Línea 1: assignmentService.assignmentsResource.isLoading()
      assignmentsResource: createMockResource([]) 
    };

    // 2. Lab Service Mock
    labServiceMock = {
      // Para HTML Línea 65: labService.labResource.value()
      labResource: createMockResource([{ id: 'lab-1', name: 'Laboratorio Central' }])
    };

    // 3. Users Service Mock
    usersServiceMock = {
      // Para HTML Línea 19: usersService.patientsResource.value()
      patientsResource: createMockResource([{ id: 'user-1', fullName: 'Paciente Juan' }])
    };

    // 4. Analysis Type Service Mock
    analysisTypeServiceMock = {
      // Para HTML Línea 42: analysisTypeService.analysisTypeResource.value()
      analysisTypeResource: createMockResource([{ id: 'ana-1', name: 'Análisis de Sangre' }])
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AssignmentForm],
      providers: [
        { provide: AssignmentService, useValue: assignmentServiceMock },
        { provide: LabService, useValue: labServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: AnalysisTypeService, useValue: analysisTypeServiceMock },
        { provide: Router, useValue: routerMock },
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentForm);
    component = fixture.componentInstance;
    
    // Silenciamos los alerts
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Disparar detección de cambios inicial (Renderiza el HTML)
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- TESTS ---

  it('debería inicializarse correctamente en modo creación (sin ID)', () => {
    fixture.detectChanges();
    expect(component.id()).toBeUndefined();
    // Accedemos al form signal de forma segura
    const val = component['form']?.().value(); 
    expect(val?.analysisId).toBe('');
  });

  it('debería inicializarse con datos en modo edición (con ID)', async () => {
    fixture.componentRef.setInput('id', 'inv-999');
    
    // Simulamos que el recurso trajo datos del backend
    resourceValueSignal.set(mockAssignmentData);
    
    fixture.detectChanges();
    await fixture.whenStable(); // Esperar a que el linkedSignal procese el cambio

    const val = component['form']().value();
    
    // Verificamos que el formulario se llenó con los datos
    expect(val.labId).toBe('lab-1');
    expect(val.patientUserId).toBe('user-1');
  });

  it('debería bloquear el envío si el formulario es inválido', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    
    // No llenamos nada, el form es inválido por defecto
    await component.sendRequest(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(assignmentServiceMock.createAssignment).not.toHaveBeenCalled();
  });

  it('debería crear una asignación exitosamente', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    const validData = { ...mockAssignmentData };
    
    // Hack para test unitario: Forzamos el estado del signal 'form'
    // Esto evita tener que simular inputs en el DOM uno por uno
    const formMock = { valid: () => true, value: () => validData };
    // @ts-ignore: Sobreescribimos propiedad protegida para el test
    component.form = () => formMock;

    await component.sendRequest(event);

    expect(assignmentServiceMock.createAssignment).toHaveBeenCalledWith(validData);
    expect(assignmentServiceMock.assignmentsResource.reload).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/assignments']);
  });

  it('debería actualizar una asignación exitosamente si existe ID', async () => {
    // Modo edición
    fixture.componentRef.setInput('id', 'inv-999');
    fixture.detectChanges();

    const event = { preventDefault: vi.fn() } as unknown as Event;
    const validData = { ...mockAssignmentData };
    
    const formMock = { valid: () => true, value: () => validData };
    // @ts-ignore
    component.form = () => formMock;

    await component.sendRequest(event);

    expect(assignmentServiceMock.updateAssignment).toHaveBeenCalledWith('inv-999', validData);
    expect(assignmentServiceMock.createAssignment).not.toHaveBeenCalled();
  });

  it('debería manejar errores al crear y mostrar mensaje', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    const formMock = { valid: () => true, value: () => mockAssignmentData };
    // @ts-ignore
    component.form = () => formMock;

    // Simulamos error del backend
    assignmentServiceMock.createAssignment.mockRejectedValue(new Error('API Error'));

    await component.sendRequest(event);

    expect(component.errorMessage()).toContain('Ocurrió un error');
    // No debe navegar si hubo error
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});