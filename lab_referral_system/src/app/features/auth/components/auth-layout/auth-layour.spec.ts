import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthLayout } from './auth-layout';
import { provideRouter } from '@angular/router'; // Necesario para que RouterOutlet funcione
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('AuthLayout', () => {
  let component: AuthLayout;
  let fixture: ComponentFixture<AuthLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayout],
      // IMPORTANTE: Al usar <router-outlet>, debemos proveer una configuración de rutas,
      // aunque esté vacía, para que el test no falle.
      providers: [provideRouter([])] 
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar el contenedor principal con las clases de estilo', () => {
    // Verificamos que existe el contenedor blanco centrado
    const card = fixture.debugElement.query(By.css('.bg-white'));
    expect(card).toBeTruthy();
    
    // Opcional: Verificar alguna clase específica de Tailwind para asegurar que es el correcto
    expect(card.classes['rounded-lg']).toBe(true);
    expect(card.classes['shadow-2xl']).toBe(true);
  });

  it('debe mostrar el logo de la aplicación', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    
    // Verificamos que la fuente de la imagen sea la correcta
    // Nota: src en el navegador devuelve la ruta absoluta, así que usamos toContain
    expect(img.nativeElement.src).toContain('images/logo.png');
  });

  it('debe contener el RouterOutlet para renderizar las vistas hijas', () => {
    // Buscamos la directiva RouterOutlet dentro del template
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).not.toBeNull();
  });
});