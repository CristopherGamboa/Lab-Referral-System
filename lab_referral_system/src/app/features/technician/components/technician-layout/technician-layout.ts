import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TechnicianNavbar } from "../technician-navbar/technician-navbar";

@Component({
  selector: 'app-technician-layout',
  imports: [RouterOutlet, TechnicianNavbar],
  templateUrl: './technician-layout.html'
})
export class TechnicianLayout {

}
