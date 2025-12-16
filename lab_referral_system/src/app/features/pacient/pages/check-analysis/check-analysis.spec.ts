import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckAnalysis } from './check-analysis';
import { AnalysisResultService } from '../../../technician/analysis-result/services/analysis-result-service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CheckAnalysis', () => {
  let component: CheckAnalysis;
  let fixture: ComponentFixture<CheckAnalysis>;
  
  // 1. Signals de control para el Mock
  // Estas son las "perillas" que moveremos en los tests para cambiar el estado del componente
  let valueSignal: any;
  let hasValueSignal: any;
  let isLoadingSignal: any;
  let errorSignal: any;

  // Datos de prueba
  const mockAnalysisData = {
    analysisType: 'Hemograma Completo',
    analysisDate: '2024-03-20',
    result: 'Niveles normales',
    notes: 'Paciente en ayunas'
  };

  beforeEach(async () => {
    // Inicializamos las signals de control
    valueSignal = signal(undefined);
    hasValueSignal = signal(false);
    isLoadingSignal = signal(false);
    errorSignal = signal(null);

    // 2. Construimos el Mock del Servicio
    // getAnalysisByAssignmentId devuelve un objeto (Resource) que contiene estas signals
    const analysisServiceMock = {
      getAnalysisByAssignmentId: vi.fn().mockReturnValue({
        value: valueSignal,
        hasValue: hasValueSignal,
        isLoading: isLoadingSignal,
        error: errorSignal,
        reload: vi.fn()
      })
    };

    await TestBed.configureTestingModule({
      imports: [CheckAnalysis],
      providers: [
        { provide: AnalysisResultService, useValue: analysisServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckAnalysis);
    component = fixture.componentInstance;
    
    // Ignoramos errores de componentes hijos que no estamos testeando (FieldErrors)
    // Opcional: si FieldErrors es complejo, podrías hacer un overrideComponent.
    
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el mensaje de "Cargando" cuando el recurso está loading', () => {
    // Arrange
    isLoadingSignal.set(true); // Simulamos estado de carga
    hasValueSignal.set(false);
    errorSignal.set(false);

    // Act
    fixture.detectChanges(); // Actualizamos el HTML

    // Assert
    const loadingMessage = fixture.debugElement.query(By.css('.text-indigo-800'));
    expect(loadingMessage).toBeTruthy();
    expect(loadingMessage.nativeElement.textContent).toContain('Estamos buscando el resultado');
  });

  it('debería mostrar el mensaje de error si no se encuentra el análisis', () => {
    // Arrange
    isLoadingSignal.set(false);
    hasValueSignal.set(false);
    errorSignal.set('Error 404'); // Simulamos error

    // Act
    fixture.detectChanges();

    // Assert
    const errorMessage = fixture.debugElement.query(By.css('.text-red-800'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('No se ha encontrado un análisis');
  });

  it('debería mostrar los detalles del análisis cuando hay datos (Success)', () => {
    // Arrange
    isLoadingSignal.set(false);
    errorSignal.set(null);
    
    // Simulamos éxito
    valueSignal.set(mockAnalysisData);
    hasValueSignal.set(true); 

    // Act
    fixture.detectChanges();

    // Assert
    // Verificamos que aparezca el tipo de análisis (h1)
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain(mockAnalysisData.analysisType);

    // Verificamos el resultado
    const paragraphs = fixture.debugElement.queryAll(By.css('p'));
    const resultText = paragraphs.find(p => p.nativeElement.textContent.includes(mockAnalysisData.result));
    expect(resultText).toBeTruthy();
  });

  it('debería actualizar el "analysisId" computado solo si el formulario es válido', () => {
    // Este es un test de LÓGICA del componente, no de template.
    
    // Caso 1: Input inválido (letras en vez de números)
    component.searchModel.set({ s: 'abc' });
    fixture.detectChanges();
    
    // El computed debería devolver undefined porque el patrón falla
    expect(component.analysisId()).toBeUndefined();

    // Caso 2: Input válido (números)
    component.searchModel.set({ s: '123' });
    fixture.detectChanges();

    // El computed debería devolver el ID
    expect(component.analysisId()).toBe('123');
  });
});