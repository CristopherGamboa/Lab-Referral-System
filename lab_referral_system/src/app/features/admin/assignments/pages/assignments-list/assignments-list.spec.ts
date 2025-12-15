import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentsList } from './assignments-list'; // Ajusta la ruta si es necesario
import { provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AssignmentService } from '../../../services/assignment-service';

describe('AssignmentsList', () => {
  let component: AssignmentsList;
  let fixture: ComponentFixture<AssignmentsList>;
  let assignmentServiceMock: any;

  // Datos dummy para que el template tenga algo que renderizar
  const mockAssignmentsData = [
    { id: '1', title: 'Assignment 1' },
    { id: '2', title: 'Assignment 2' }
  ];

  beforeEach(async () => {
    // 1. Corregimos el Mock del Servicio
    assignmentServiceMock = {
      deleteAssignment: vi.fn(),
      assignmentsResource: {
        // CORRECCIÓN CRÍTICA:
        // El template llama a .value(), así que debemos mockearlo como una función
        // que retorna nuestros datos de prueba.
        value: vi.fn().mockReturnValue(mockAssignmentsData),
        
        // También es buena práctica mockear isLoading y error por si el template los usa
        isLoading: vi.fn().mockReturnValue(false),
        error: vi.fn().mockReturnValue(null),
        
        // El método reload que ya teníamos
        reload: vi.fn() 
      }
    };

    await TestBed.configureTestingModule({
      imports: [AssignmentsList], 
      providers: [
        { provide: AssignmentService, useValue: assignmentServiceMock },
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentsList);
    component = fixture.componentInstance;
    
    // Esto dispara el ngOnInit y el renderizado del HTML. 
    // Ahora funcionará porque .value() existe en el mock.
    fixture.detectChanges(); 
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería eliminar la asignación y recargar la lista si el usuario confirma', () => {
    // Arrange
    const idToDelete = 'inv-123';
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    // Act
    component.deleteAssignment(idToDelete);

    // Assert
    expect(confirmSpy).toHaveBeenCalled();
    expect(assignmentServiceMock.deleteAssignment).toHaveBeenCalledWith(idToDelete);
    expect(assignmentServiceMock.assignmentsResource.reload).toHaveBeenCalled();
  });

  it('NO debería eliminar ni recargar si el usuario cancela la confirmación', () => {
    // Arrange
    const idToDelete = 'inv-123';
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    // Act
    component.deleteAssignment(idToDelete);

    // Assert
    expect(confirmSpy).toHaveBeenCalled();
    expect(assignmentServiceMock.deleteAssignment).not.toHaveBeenCalled();
    expect(assignmentServiceMock.assignmentsResource.reload).not.toHaveBeenCalled();
  });

  it('debería manejar errores silenciosamente si el servicio falla', () => {
    // Arrange
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    // Hacemos que delete falle
    assignmentServiceMock.deleteAssignment.mockImplementation(() => {
      throw new Error('Error de red');
    });

    // Act & Assert
    expect(() => component.deleteAssignment('inv-123')).not.toThrow();
    
    // Verificamos que reload NO se llame si hubo error antes
    expect(assignmentServiceMock.assignmentsResource.reload).not.toHaveBeenCalled();
  });
});