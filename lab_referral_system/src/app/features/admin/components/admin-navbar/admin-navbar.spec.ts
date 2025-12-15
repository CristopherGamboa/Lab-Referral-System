import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNavbar } from './admin-navbar'; 
import { AuthService } from '../../../auth/services/auth-service'; 
import { provideRouter, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('AdminNavbar', () => {
  let component: AdminNavbar;
  let fixture: ComponentFixture<AdminNavbar>;

  const mockAuthService = {
    logout: vi.fn()
  };

  beforeEach(async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [AdminNavbar], // Componente Standalone
      providers: [
        // Inyectamos el mock en lugar del servicio real
        { provide: AuthService, useValue: mockAuthService },
        // Necesario para que las etiquetas <a routerLink="..."> no lancen error
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el logo', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('images/logo.png');
  });

  it('debe tener enlaces a Usuarios y Asignaciones', () => {
    // Buscamos todos los elementos que tengan la directiva RouterLink
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    
    // Deberían ser al menos 2 (Usuarios y Asignaciones)
    expect(links.length).toBeGreaterThanOrEqual(2);

    // Verificamos que apunten a las rutas correctas
    // routerLink almacena el destino en sus propiedades
    const userLink = links.find(l => l.attributes['routerLink'] === '/admin/users');
    const assignmentsLink = links.find(l => l.attributes['routerLink'] === '/admin/assignments');

    expect(userLink).toBeTruthy();
    expect(assignmentsLink).toBeTruthy();
  });

  it('debe llamar a authService.logout() al hacer click en el botón de salir', () => {
    // Buscamos el botón. Como es el único botón en el navbar, usamos 'button'
    const logoutBtn = fixture.debugElement.query(By.css('button'));
    
    // Simulamos el click
    logoutBtn.triggerEventHandler('click', null);

    // Verificamos que el espía haya sido llamado
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});