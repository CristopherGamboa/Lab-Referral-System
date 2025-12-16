import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserForm } from './user-form'; 
import { UsersService } from '../../services/users-service';
import { LabService } from '../../../services/lab-service';
import { Router, provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signal } from '@angular/core';

describe('UserForm', () => {
  let component: UserForm;
  let fixture: ComponentFixture<UserForm>;

  let usersServiceMock: any;
  let labServiceMock: any;
  let routerMock: any;

  let userResourceValue: any;
  let userResourceLoading: any;

  const createMockResource = (data: any = []) => ({
    value: signal(data),
    isLoading: signal(false),
    error: signal(null),
    reload: vi.fn()
  });

  const mockUser = {
    id: 'user-123',
    fullName: 'John Doe',
    email: 'john@example.com',
    roles: ['TECHNICIAN'],
    labId: 'lab-1'
  };

  const mockLabs = [
    { id: 'lab-1', name: 'Main Lab' },
    { id: 'lab-2', name: 'Secondary Lab' }
  ];

  const validFormData = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
    role: 'TECHNICIAN',
    labId: 'lab-1'
  };

  beforeEach(async () => {
    userResourceValue = signal(null);
    userResourceLoading = signal(false);

    usersServiceMock = {
      getUserById: vi.fn().mockReturnValue({
        value: userResourceValue,
        isLoading: userResourceLoading,
        error: signal(null),
        reload: vi.fn()
      }),
      usersResource: createMockResource([]), 
      createUser: vi.fn().mockResolvedValue({ success: true }),
      updateUser: vi.fn().mockResolvedValue({ success: true })
    };

    labServiceMock = {
      labResource: createMockResource(mockLabs)
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [UserForm],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: LabService, useValue: labServiceMock },
        { provide: Router, useValue: routerMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserForm);
    component = fixture.componentInstance;
    
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });


  it('should create correctly in Create Mode (no ID)', () => {
    expect(component).toBeTruthy();
    expect(component.id()).toBeUndefined();
    const currentModel = component['userModel']();
    expect(currentModel.fullName).toBe('');
    expect(currentModel.role).toBe('TECHNICIAN');
  });

  it('should initialize correctly in Edit Mode (with ID)', async () => {
    fixture.componentRef.setInput('id', 'user-123');
    userResourceValue.set(mockUser); 

    fixture.detectChanges();
    await fixture.whenStable(); 

    const currentModel = component['userModel']();
    expect(currentModel.fullName).toBe('John Doe');
    expect(currentModel.email).toBe('john@example.com');

    expect(currentModel.role).toBe('TECHNICIAN');
    expect(currentModel.labId).toBe('lab-1');
  });

  it('should show loading state if resource is loading', () => {
    userResourceLoading.set(true);
    fixture.detectChanges();
    
    const formElement = fixture.nativeElement.querySelector('form');
    expect(formElement).toBeNull();
  });


  it('should block submission if form is invalid', async () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    
    await component.sendRequest(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(usersServiceMock.createUser).not.toHaveBeenCalled();
  });

  it('should show Labs dropdown only when Role is TECHNICIAN', () => {
    component['userModel'].set({ ...validFormData, role: 'TECHNICIAN' });
    fixture.detectChanges();
    
    let labSelect = fixture.nativeElement.querySelector('#labId');
    expect(labSelect).toBeTruthy();

    component['userModel'].set({ ...validFormData, role: 'PATIENT' });
    fixture.detectChanges();

    labSelect = fixture.nativeElement.querySelector('#labId');
    expect(labSelect).toBeNull(); 
  });
});