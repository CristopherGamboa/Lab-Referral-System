import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianLayout } from './technician-layout';
import { TechnicianNavbar } from '../technician-navbar/technician-navbar'; // Componente Real
import { AuthService } from '../../../auth/services/auth-service';
import { provideRouter, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TechnicianLayout', () => {
  let component: TechnicianLayout;
  let fixture: ComponentFixture<TechnicianLayout>;

  beforeEach(async () => {
    const authServiceMock = {
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TechnicianLayout],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicianLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navbar and router outlet', () => {
    // Verificamos que se renderizan los componentes reales
    const navbar = fixture.debugElement.query(By.directive(TechnicianNavbar));
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    
    expect(navbar).toBeTruthy();
    expect(outlet).toBeTruthy();
  });

  it('should verify layout structure', () => {
    // Verificamos que el HTML del template se lee
    const mainElement = fixture.debugElement.query(By.css('main'));
    expect(mainElement).toBeTruthy();
    expect(mainElement.classes['overflow-auto']).toBe(true);
  });
});