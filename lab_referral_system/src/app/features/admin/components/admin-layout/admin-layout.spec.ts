import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLayout } from './admin-layout';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { AdminNavbar } from '../admin-navbar/admin-navbar';
import { RouterOutlet } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

// 1. Mock del componente hijo (AdminNavbar)
// Esto es CRUCIAL en Unit Testing: aislamos el Layout de la complejidad del Navbar.
@Component({
  selector: 'app-admin-navbar',
  standalone: true, // En Angular 21 es true por defecto, pero explícito para mocks ayuda
  template: '<div data-testid="mock-navbar"></div>'
})
class MockAdminNavbar {}

describe('AdminLayout', () => {
  let component: AdminLayout;
  let fixture: ComponentFixture<AdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayout], // Importamos el componente bajo prueba
      providers: [
        provideRouter([]) // Proveedor moderno para manejar <router-outlet> sin RouterTestingModule
      ]
    })
    // 2. Sobrescribimos las dependencias del componente
    // Reemplazamos el AdminNavbar real por nuestro Mock
    .overrideComponent(AdminLayout, {
      remove: { imports: [AdminNavbar] },
      add: { imports: [MockAdminNavbar] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara el ciclo de vida inicial
  });

  it('should create the layout', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBAS DE ESTRUCTURA DOM ---

  it('should render the AdminNavbar', () => {
    // Buscamos por la directiva del componente mockeado
    const navbarDebugEl = fixture.debugElement.query(By.directive(MockAdminNavbar));
    
    expect(navbarDebugEl).toBeTruthy();
    // Opcional: Verificar que las clases CSS del padre se aplican si son importantes
    // Nota: Validar clases de Tailwind puede hacer el test frágil, úsalo con mesura.
  });

  it('should contain a RouterOutlet for child routes', () => {
    // Buscamos la directiva RouterOutlet
    const outletDebugEl = fixture.debugElement.query(By.directive(RouterOutlet));
    
    expect(outletDebugEl).toBeTruthy();
  });

  it('should have the correct structure containers', () => {
    // Verificamos que existe el contenedor principal del contenido (el div índigo)
    // Usamos clases CSS para localizarlo, o mejor aún, podrías añadir data-testid en el HTML
    const mainContainer = fixture.debugElement.query(By.css('div.bg-indigo-900'));
    const scrollableArea = fixture.debugElement.query(By.css('main.overflow-auto'));

    expect(mainContainer).toBeTruthy();
    expect(scrollableArea).toBeTruthy();
  });
});