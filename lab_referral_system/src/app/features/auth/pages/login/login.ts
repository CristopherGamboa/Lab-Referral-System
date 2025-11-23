import { Component, inject, signal } from '@angular/core';
import { email, Field, form, required, schema } from '@angular/forms/signals';
import { LoginData } from '../../interfaces/login-data';
import { FieldErrors } from "../../../../shared/components/forms/field-errors/field-errors";
import { SubmitButton } from "../../../../shared/components/forms/submit-button/submit-button";
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [Field, FieldErrors, SubmitButton, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected formModel = signal<LoginData>({
    email: '',
    password: '',
  });

  protected form = form(this.formModel, p => {
    required(p.email);
    email(p.email);
    required(p.password);
  });

  isSubmitting = signal(false);
  errorMessage = signal('');

  async login(event: Event) {
    event.preventDefault();
    if (!this.form().valid()) return;

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    try {
      const response = await this.authService.login(this.form().value());

      if (response.accessToken)
        this.authService.setToken(response.accessToken);
      
      const role = this.authService.getRoleFromToken();
      
      if (role == 'ROLE_ADMIN')
        await this.router.navigate(['admin/users']);
    
      if (role == 'ROLE_TECHNICIAN')
        await this.router.navigate(['technician/assignments']);
      
    } catch (error) {
      this.errorMessage.set('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      this.isSubmitting.set(false);
    }
  };
}
