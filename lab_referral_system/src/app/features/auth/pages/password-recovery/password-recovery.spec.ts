import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordRecovery } from './password-recovery';
import { AuthService } from '../../services/auth-service';
import { Router, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

// 1. Mocks
const mockRouter = {
  navigate: vi.fn()
};

// Aunque no uses el AuthService en el método, lo inyectas, 
// así que debemos proveerlo para que Angular no falle al crear el componente.
const mockAuthService = {}; 

describe('PasswordRecovery Component', () => {
  let component: PasswordRecovery;
  let fixture: ComponentFixture<PasswordRecovery>;

  beforeEach(async () => {
    vi.clearAllMocks(); // Limpiamos contadores de llamadas

    await TestBed.configureTestingModule({
      imports: [PasswordRecovery],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([]) // Para routerLink en el template
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordRecovery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('NO debe enviar ni navegar si el formulario es inválido (email vacío)', async () => {
    // Espiamos window.alert para asegurarnos de que NO se llame
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    // El email inicia vacío, por lo que el formulario es inválido
    const event = { preventDefault: vi.fn() } as unknown as Event;
    
    await component.login(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('DEBE mostrar alert y navegar al login si el formulario es válido', async () => {
    // 1. Espiamos window.alert (y evitamos que salga el popup real)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // 2. Establecemos un email válido en el Signal del formulario
    // Nota: La password ya viene con 'fakePassword' en tu código, así que solo falta el email
    component['formModel'].update(val => ({ ...val, email: 'test@duoc.cl' }));
    fixture.detectChanges();

    // 3. Ejecutamos la acción
    const event = { preventDefault: vi.fn() } as unknown as Event;
    await component.login(event);

    // 4. Verificaciones
    expect(alertSpy).toHaveBeenCalledWith('¡Se ha enviado un correo de recuperación de contraseña a su email!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('debe tener el enlace para volver a iniciar sesión', () => {
    // Verificamos que existe el link "Iniciar sesión" en el HTML
    const link = fixture.debugElement.query(By.css('a[routerLink="/auth/login"]'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent.trim()).toBe('Iniciar sesión');
  });

  it('debe mostrar el componente de errores de campo', () => {
    // Verificamos que el componente hijo app-field-errors está presente en el template
    const fieldErrors = fixture.debugElement.query(By.css('app-field-errors'));
    expect(fieldErrors).toBeTruthy();
  });
});