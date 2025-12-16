import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../services/auth-service';
import { Router, provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { By } from '@angular/platform-browser';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  
  let authServiceMock: any;
  // Usaremos la instancia real del Router inyectada por provideRouter
  let router: Router; 

  const validCredentials = { email: 'test@test.com', password: 'password123' };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),
      setToken: vi.fn(),
      getRoleFromToken: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        // CORRECCIÓN:
        // 1. Quitamos { provide: Router, useValue: routerMock }
        // 2. Dejamos solo provideRouter([]) para que configure todo correctamente
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    
    // CORRECCIÓN:
    // Inyectamos el Router real y le ponemos un espía
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate'); // Esto intercepta las llamadas sin romper la lógica interna

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debería crearse correctamente y renderizar el formulario', () => {
    expect(component).toBeTruthy();
    
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));
    const submitBtn = fixture.debugElement.query(By.css('app-submit-button'));
    const recoveryLink = fixture.debugElement.query(By.css('a[routerLink="/auth/password-recovery"]'));

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitBtn).toBeTruthy();
    expect(recoveryLink).toBeTruthy();
  });

  it('debería detener el login si el formulario es inválido', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    
    await component.login(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('debería loguear a un ADMIN y redirigir a /admin/users', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    
    const formMock = { valid: () => true, value: () => validCredentials };
    // @ts-ignore
    component.form = () => formMock;

    authServiceMock.login.mockResolvedValue({ accessToken: 'fake-token-123' });
    authServiceMock.getRoleFromToken.mockReturnValue('ROLE_ADMIN');

    await component.login(event);

    expect(authServiceMock.login).toHaveBeenCalledWith(validCredentials);
    expect(authServiceMock.setToken).toHaveBeenCalledWith('fake-token-123');
    
    // Verificamos contra la variable 'router' (que tiene el espía)
    expect(router.navigate).toHaveBeenCalledWith(['admin/users']);
    expect(component.isSubmitting()).toBe(false);
  });

  it('debería loguear a un TÉCNICO y redirigir a /technician/assignments', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    
    const formMock = { valid: () => true, value: () => validCredentials };
    // @ts-ignore
    component.form = () => formMock;

    authServiceMock.login.mockResolvedValue({ accessToken: 'fake-token-abc' });
    authServiceMock.getRoleFromToken.mockReturnValue('ROLE_TECHNICIAN');

    await component.login(event);

    expect(authServiceMock.setToken).toHaveBeenCalledWith('fake-token-abc');
    expect(router.navigate).toHaveBeenCalledWith(['technician/assignments']);
  });

  it('debería loguear correctamente pero NO redirigir si el rol es desconocido', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    const formMock = { valid: () => true, value: () => validCredentials };
    // @ts-ignore
    component.form = () => formMock;

    authServiceMock.login.mockResolvedValue({ accessToken: 'token' });
    authServiceMock.getRoleFromToken.mockReturnValue('ROLE_UNKNOWN');

    await component.login(event);

    expect(authServiceMock.setToken).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('debería manejar el error si el login falla (Catch Block)', async () => {
    // Arrange
    const event = { preventDefault: vi.fn() } as unknown as Event;
    
    // CORRECCIÓN CRÍTICA:
    // En lugar de hackear component.form = ..., llenamos el modelo real.
    // Esto mantiene intacta la estructura interna que necesita el HTML.
    // Accedemos con ['formModel'] porque es protected.
    component['formModel'].set(validCredentials);
    
    // Forzamos la actualización para que el form calcule su validez
    fixture.detectChanges(); 

    // Simulamos error del backend
    authServiceMock.login.mockRejectedValue(new Error('Unauthorized'));

    // Act
    await component.login(event);

    // Assert
    expect(component.errorMessage()).toBe('Error al iniciar sesión. Intente nuevamente.');
    expect(component.isSubmitting()).toBe(false);
    expect(authServiceMock.setToken).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    
    // Ahora podemos detectar cambios sin que explote el template
    fixture.detectChanges();
    const errorMsgElement = fixture.debugElement.query(By.css('.text-red-700'));
    expect(errorMsgElement.nativeElement.textContent).toContain('Error al iniciar sesión');
  });

  it('no debería setear token si la respuesta no trae accessToken', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    const formMock = { valid: () => true, value: () => validCredentials };
    // @ts-ignore
    component.form = () => formMock;

    authServiceMock.login.mockResolvedValue({}); 
    authServiceMock.getRoleFromToken.mockReturnValue('ROLE_ADMIN');

    await component.login(event);

    expect(authServiceMock.setToken).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });
});