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
  selector: 'app-password-recovery',
  imports: [Field, FieldErrors, SubmitButton, FormsModule],
  templateUrl: './password-recovery.html'
})
export class PasswordRecovery {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected formModel = signal<LoginData>({
    email: '',
    password: 'fakePassword',
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

    alert('¡Se ha enviado un correo de recuperación de contraseña a su email!');
    this.router.navigate(["/auth/login"]);
  }
}
