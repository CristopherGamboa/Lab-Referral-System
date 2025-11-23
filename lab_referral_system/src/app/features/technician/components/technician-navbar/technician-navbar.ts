import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-technician-navbar',
  imports: [RouterLink],
  templateUrl: './technician-navbar.html'
})
export class TechnicianNavbar {
  private readonly authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
