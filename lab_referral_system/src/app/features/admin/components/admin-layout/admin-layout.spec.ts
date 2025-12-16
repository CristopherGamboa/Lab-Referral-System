import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLayout } from './admin-layout';
import { AuthService } from '../../../auth/services/auth-service'; // Importamos el servicio real para el token
import { provideRouter, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdminNavbar } from '../admin-navbar/admin-navbar'; // Importamos el componente real

describe('AdminLayout', () => {
  let component: AdminLayout;
  let fixture: ComponentFixture<AdminLayout>;

  beforeEach(async () => {
    // Mockeamos el AuthService que necesita el AdminNavbar (el hijo)
    const authServiceMock = {
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AdminLayout], // Importamos el Layout real (que a su vez importa el Navbar real)
      providers: [
        provideRouter([]), // Necesario para <router-outlet> y routerLinks del navbar
        { provide: AuthService, useValue: authServiceMock } // Proveemos la dependencia del HIJO
      ]
    })
    // ELIMINAMOS EL BLOQUE .overrideComponent
    .compileComponents();

    fixture = TestBed.createComponent(AdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el Navbar y el Outlet', () => {
    // Ahora buscamos el componente REAL, no el mock
    const navbar = fixture.debugElement.query(By.directive(AdminNavbar));
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(navbar).toBeTruthy();
    expect(outlet).toBeTruthy();
  });

  it('debería tener la estructura CSS correcta', () => {
    // Validamos el contenedor del HTML
    const mainContainer = fixture.debugElement.query(By.css('.bg-indigo-900'));
    expect(mainContainer).toBeTruthy();
  });
});