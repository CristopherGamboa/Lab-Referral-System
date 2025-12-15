import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersList } from './users-list'; // Ajusta la ruta
import { UsersService } from '../../services/users-service';
import { provideRouter, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';
import { signal, WritableSignal } from '@angular/core';
import { vi } from 'vitest';

describe('UsersList', () => {
  let component: UsersList;
  let fixture: ComponentFixture<UsersList>;

  // 1. Signal para controlar los datos de la tabla
  let usersDataSignal: WritableSignal<any[]>;

  // 2. Mock del Servicio
  const mockUsersService = {
    usersResource: {
      // Conectamos el signal aquí para que el template lo lea
      value: undefined as any, 
      reload: vi.fn()
    },
    deleteUser: vi.fn()
  };

  beforeEach(async () => {
    // Inicializamos el signal antes de cada test
    usersDataSignal = signal([]);
    mockUsersService.usersResource.value = usersDataSignal;
    
    // Limpiamos los espías
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [UsersList],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        provideRouter([]) // Necesario para los RouterLink
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersList);
    component = fixture.componentInstance;
    
    // NOTA: No llamamos a detectChanges() aquí todavía para poder configurar 
    // datos iniciales en algunos tests si fuera necesario.
  });

  it('debe crearse correctamente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debe recargar los usuarios al iniciar (ngOnInit)', () => {
    // Al detectar cambios, se ejecuta ngOnInit
    fixture.detectChanges();
    expect(mockUsersService.usersResource.reload).toHaveBeenCalled();
  });

  it('debe renderizar la lista de usuarios desde el recurso', () => {
    // 1. Seteamos datos simulados en el signal
    const mockUsers = [
      { id: '1', fullName: 'Juan Perez', email: 'juan@test.com', isActive: true, roles: ['ADMIN'] },
      { id: '2', fullName: 'Maria Lopez', email: 'maria@test.com', isActive: false, roles: ['PATIENT'] }
    ];
    usersDataSignal.set(mockUsers);

    // 2. Renderizamos
    fixture.detectChanges();

    // 3. Verificamos que haya 2 artículos (tarjetas)
    const articles = fixture.debugElement.queryAll(By.css('article'));
    expect(articles.length).toBe(2);

    // 4. Verificamos contenido de texto del primero
    const firstCardText = articles[0].nativeElement.textContent;
    expect(firstCardText).toContain('Juan Perez');
    expect(firstCardText).toContain('juan@test.com');
  });

  it('debe tener un botón para crear nuevo usuario', () => {
    fixture.detectChanges();
    
    // Buscamos el link que lleva a /new
    const createLink = fixture.debugElement.query(By.directive(RouterLink));
    // O buscamos por atributo si hay varios
    const link = fixture.debugElement.query(By.css('a[href="/admin/users/new"]'));
    
    // Angular test a veces no refleja el href en el DOM real sin clickear, 
    // pero podemos verificar el input del routerLink
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    const createBtn = links.find(l => l.attributes['routerLink'] === '/admin/users/new');
    
    expect(createBtn).toBeTruthy();
  });

  // --- TESTS DE ELIMINACIÓN ---

  it('debe llamar a deleteUser y recargar SI el usuario confirma', async () => {
    // 1. Datos iniciales
    usersDataSignal.set([{ id: '1', fullName: 'Borrarme', roles: [] }]);
    fixture.detectChanges();

    // 2. Mock de window.confirm para que devuelva TRUE
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockUsersService.deleteUser.mockResolvedValue(undefined); // Promesa resuelta

    // 3. Simular click en el botón de borrar
    const deleteBtn = fixture.debugElement.query(By.css('button')); // El único botón en la tarjeta
    deleteBtn.triggerEventHandler('click', null);

    // 4. Esperar a que la promesa se resuelva
    await fixture.whenStable();

    // 5. Verificaciones
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockUsersService.deleteUser).toHaveBeenCalledWith('1');
    // Debe recargar la lista tras borrar (se llama 2 veces: 1 en init, 1 tras borrar)
    expect(mockUsersService.usersResource.reload).toHaveBeenCalledTimes(2);
  });

  it('NO debe borrar nada SI el usuario cancela la confirmación', async () => {
    usersDataSignal.set([{ id: '1', fullName: 'No Borrarme', roles: [] }]);
    fixture.detectChanges();

    // 1. Mock de window.confirm para que devuelva FALSE
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    // 2. Click
    const deleteBtn = fixture.debugElement.query(By.css('button'));
    deleteBtn.triggerEventHandler('click', null);

    await fixture.whenStable();

    // 3. Verificaciones
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockUsersService.deleteUser).not.toHaveBeenCalled();
    // Solo 1 llamada a reload (la del ngOnInit)
    expect(mockUsersService.usersResource.reload).toHaveBeenCalledTimes(1);
  });
});