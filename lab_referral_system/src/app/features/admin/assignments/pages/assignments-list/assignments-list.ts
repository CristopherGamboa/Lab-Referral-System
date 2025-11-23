import { Component, inject } from '@angular/core';
import { AssignmentService } from '../../../services/assignment-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-assignments-list',
  imports: [RouterLink],
  templateUrl: './assignments-list.html'
})
export class AssignmentsList {
  assignmentService = inject(AssignmentService);

  deleteAssignment(id: string) {
    if(confirm('¿Estás seguro que quieres borrar este recurso?'))
    {
      try {
        this.assignmentService.deleteAssignment(id);
        this.assignmentService.assignmentsResource.reload();
      } catch (error) {
        
      }
    }
  }
}
