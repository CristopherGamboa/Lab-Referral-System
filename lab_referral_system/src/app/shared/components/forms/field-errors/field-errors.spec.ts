import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldErrors } from './field-errors'; 
import { By } from '@angular/platform-browser';

describe('FieldErrors', () => {
  let component: FieldErrors;
  let fixture: ComponentFixture<FieldErrors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldErrors]
    }).compileComponents();

    fixture = TestBed.createComponent(FieldErrors);
    component = fixture.componentInstance;
    
    // Inicializamos los inputs requeridos con valores por defecto para evitar errores en el primer ciclo
    fixture.componentRef.setInput('touched', false);
    fixture.componentRef.setInput('fieldErrors', null);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('NO debe mostrar errores si el campo NO ha sido "tocado" (touched=false)', () => {
    // Escenario: Hay error, pero el usuario no ha tocado el campo
    fixture.componentRef.setInput('touched', false);
    fixture.componentRef.setInput('fieldErrors', [{ kind: 'required', error: true }]);
    fixture.detectChanges();

    const computedResult = component.hasErrors();
    expect(computedResult).toBe(false); // Validamos lógica

    const errorDiv = fixture.debugElement.query(By.css('.text-red-800'));
    expect(errorDiv).toBeNull(); // Validamos HTML (no debe existir)
  });

  it('NO debe mostrar errores si la lista de errores es nula o vacía', () => {
    // Escenario: Tocado true, pero sin errores
    fixture.componentRef.setInput('touched', true);
    fixture.componentRef.setInput('fieldErrors', null);
    fixture.detectChanges();

    expect(component.hasErrors()).toBe(false);
    expect(fixture.debugElement.query(By.css('.text-red-800'))).toBeNull();
  });

  it('DEBE mostrar el mensaje correcto cuando hay error y está tocado', () => {
    // Escenario: Tocado y error 'required'
    fixture.componentRef.setInput('touched', true);
    // Simulamos la estructura que espera tu template: un objeto con propiedad 'kind'
    fixture.componentRef.setInput('fieldErrors', [{ kind: 'required' } as any]); 
    fixture.detectChanges();

    expect(component.hasErrors()).toBe(true);

    const errorDiv = fixture.debugElement.query(By.css('.text-red-800'));
    expect(errorDiv).not.toBeNull();
    // Verificamos que el texto coincida con tu diccionario 'messages'
    expect(errorDiv.nativeElement.textContent).toContain('Este campo es requerido');
  });

  it('DEBE mostrar múltiples mensajes si hay múltiples errores', () => {
    // Escenario: Contraseña corta y sin mayúscula
    fixture.componentRef.setInput('touched', true);
    fixture.componentRef.setInput('fieldErrors', [
      { kind: 'minlengthpassword' } as any,
      { kind: 'uppercasepassword' } as any
    ]); 
    fixture.detectChanges();

    const errorDivs = fixture.debugElement.queryAll(By.css('.text-red-800'));
    expect(errorDivs.length).toBe(2); // Deben haber 2 divs

    expect(errorDivs[0].nativeElement.textContent).toContain('La contraseña debe tener al menos 6 caracteres');
    expect(errorDivs[1].nativeElement.textContent).toContain('La contraseña debe contener al menos una mayúscula');
  });
});