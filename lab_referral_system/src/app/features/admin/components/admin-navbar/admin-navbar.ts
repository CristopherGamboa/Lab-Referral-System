import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-admin-navbar',
  imports: [RouterLink],
  templateUrl: './admin-navbar.html'
})
export class AdminNavbar {
  private readonly authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
