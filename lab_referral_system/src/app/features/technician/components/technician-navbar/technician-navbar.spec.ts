import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianNavbar } from './technician-navbar';
import { AuthService } from '../../../auth/services/auth-service';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('TechnicianNavbar', () => {
  let component: TechnicianNavbar;
  let fixture: ComponentFixture<TechnicianNavbar>;
  let authServiceMock: any;

  beforeEach(async () => {
    // 1. Mockeamos el AuthService
    // Solo necesitamos espiar el método logout, no que haga nada real.
    authServiceMock = {
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TechnicianNavbar],
      providers: [
        // Proveemos el Router vacío para que routerLink no falle
        provideRouter([]), 
        // Inyectamos nuestro mock
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicianNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar los elementos visuales clave (Logo y Links)', () => {
    // Verificar que el logo existe y tiene la ruta correcta
    const logo = fixture.debugElement.query(By.css('img'));
    expect(logo).toBeTruthy();
    expect(logo.attributes['src']).toContain('logo.png');

    // Verificar que existe el enlace a asignaciones
    // Usamos el selector de atributo para ser muy precisos
    const link = fixture.debugElement.query(By.css('a[routerLink="/technician/assignments"]'));
    expect(link).toBeTruthy();
    
    // Verificar texto (útil si hay cambios accidentales en el UI)
    expect(link.nativeElement.textContent).toContain('Asignaciones');
  });

  it('debería ejecutar el logout al hacer click en el botón de salida', () => {
    // 1. Buscamos el botón (el único button en el componente)
    const logoutBtn = fixture.debugElement.query(By.css('button'));
    
    // 2. Simulamos el evento click
    logoutBtn.triggerEventHandler('click', null);

    // 3. Verificamos que se haya llamado al método del servicio
    // Esto cubre la línea "this.authService.logout()" y el binding "(click)" del HTML
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});