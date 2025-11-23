import { Component, computed, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { CreateUserData } from '../../interfaces/create-user-data';
import { customError, email, form, minLength, required, validate, Field, applyWhen, disabled } from '@angular/forms/signals';
import { SubmitButton } from "../../../../../shared/components/forms/submit-button/submit-button";
import { FieldErrors } from "../../../../../shared/components/forms/field-errors/field-errors";
import { UsersService } from '../../services/users-service';
import { httpResource } from '@angular/common/http';
import { AssignmentService } from '../../../services/assignment-service';
import { LabService } from '../../../services/lab-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  imports: [SubmitButton, FieldErrors, Field],
  templateUrl: './user-form.html'
})
export class UserForm {
  id = input<string>();
  
  usersService = inject(UsersService);
  labService = inject(LabService);
  router = inject(Router);
  userResource = this.usersService.getUserById(this.id);
  
  private emptyUserModel: CreateUserData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'TECHNICIAN',
    labId: '1'
  };

  protected userModel = linkedSignal<CreateUserData>(() => {
    const user = this.userResource.value();

    if (!user)
      return this.emptyUserModel

    return {
      fullName: user.fullName,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.roles[0],
      labId: user.labId
    }
  })

  protected form = form(this.userModel, p => {
    required(p.fullName);
    required(p.email);
    email(p.email);
    required(p.password);
    minLength(p.password, 6);
    validate(p.password, ({value}) => {
      if (!/[A-Z]/.test(value()))
        return customError({kind: 'uppercasepassword'});
      
      if (!/[a-z]/.test(value()))
        return customError({kind: 'lowercasepassword'});
      
      if (!/[0-9]/.test(value()))
        return customError({kind: 'digitpassword'});

      if (!/[^a-zA-Z0-9]/.test(value()))
        return customError({kind: 'nonalphanumericpassword'});

      return;
    });
    required(p.confirmPassword);
    validate(p.confirmPassword, ({value, valueOf}) => {
      if (valueOf(p.password) !== value()) 
        return customError({kind: 'passwordmismatch'});
      
      return;
    });
    disabled(p.role, () => this.id() != undefined);
    required(p.role);
    disabled(p.labId, () => this.id() != undefined);
    required(p.labId, {
      when: ({ valueOf }) => valueOf(p.role) === 'TECHNICIAN'
    })
  });

  isSubmitting = signal(false);
  errorMessage = signal('');

  async sendRequest(event: Event) {
    event.preventDefault();
    if (!this.form().valid()) return;
    
    this.errorMessage.set('');
    this.isSubmitting.set(true);

    if (!this.id())
      await this.createUser(this.form().value());

    if (this.id())
      await this.updateUser(this.id()!, this.form().value());

    this.isSubmitting.set(false);
    if (this.errorMessage() == '')
    {
      this.usersService.usersResource.reload();
      alert('¡Operación exitosa!')
      this.router.navigate(['/admin/users']);
    }
  }

  private async createUser(user: CreateUserData) {
    try {
      const response = await this.usersService.createUser(user);
    } catch (error) {
      this.errorMessage.set('Ocurrió un error al crear el usuario. Intente de nuevo');
    }
  }

  private async updateUser(id: string, user: CreateUserData) {
    try {
      const response = await this.usersService.updateUser(id, user);
    } catch (error) {
      this.errorMessage.set('Ocurrió un error al actualizar el usuario. Intente de nuevo');
    }
  }
}
