import { Component } from '@angular/core';
import { AdminNavbar } from "../admin-navbar/admin-navbar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminNavbar, RouterOutlet],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {

}
