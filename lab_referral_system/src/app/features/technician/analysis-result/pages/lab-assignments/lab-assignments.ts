import { Component, inject, linkedSignal, signal } from '@angular/core';
import { AssignmentService } from '../../../../admin/services/assignment-service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth-service';

@Component({
  selector: 'app-lab-assignments',
  imports: [RouterLink],
  templateUrl: './lab-assignments.html'
})
export class LabAssignments {
  authService = inject(AuthService);
  assignmentService = inject(AssignmentService);

  labId = signal(this.authService.getLabFromToken() || undefined);
  assignmentsResource = this.assignmentService.getAssignmentsByLabId(this.labId);
}
