import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmitButton } from './submit-button';
import { By } from '@angular/platform-browser';

describe('SubmitButton', () => {
  let component: SubmitButton;
  let fixture: ComponentFixture<SubmitButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitButton]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitButton);
    component = fixture.componentInstance;
    
    // IMPORTANTE: Al ser un input.required, debemos darle valor antes del primer detectChanges()
    fixture.componentRef.setInput('content', 'Guardar Cambios');
    fixture.detectChanges();
  });

  it('debe crearse y mostrar el texto del contenido correctamente', () => {
    expect(component).toBeTruthy();
    
    const buttonElement = fixture.debugElement.query(By.css('button'));
    // Verificamos que el texto 'Guardar Cambios' esté dentro del botón
    expect(buttonElement.nativeElement.textContent).toContain('Guardar Cambios');
  });

  it('NO debe mostrar el spinner de carga por defecto (loading=false)', () => {
    // Por defecto loading es false en tu componente
    const spinner = fixture.debugElement.query(By.css('.animate-spin')); // Buscamos por la clase de animación
    expect(spinner).toBeNull();
  });

  it('DEBE mostrar el spinner cuando loading es true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.animate-spin'));
    expect(spinner).not.toBeNull();
    // Opcional: Verificar que hay un SVG dentro
    expect(spinner.query(By.css('svg'))).toBeTruthy();
  });

  it('debe estar habilitado por defecto', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.disabled).toBe(false);
  });

  it('debe deshabilitarse cuando el input disabled es true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    // Verificamos la propiedad nativa del DOM
    expect(buttonElement.nativeElement.disabled).toBe(true);
  });

  it('debe reflejar el título personalizado si se proporciona', () => {
    const testTitle = 'Haga click para enviar';
    fixture.componentRef.setInput('title', testTitle);
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.title).toBe(testTitle);
  });

  it('debe tener el título por defecto si no se proporciona uno', () => {
    // No seteamos el input title, así que usa el default: 'Submit button'
    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.title).toBe('Submit button');
  });
});