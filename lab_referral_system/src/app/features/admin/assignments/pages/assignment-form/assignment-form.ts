import { Component, inject, input, linkedSignal, signal } from '@angular/core';
import { SubmitButton } from "../../../../../shared/components/forms/submit-button/submit-button";
import { FieldErrors } from "../../../../../shared/components/forms/field-errors/field-errors";
import { form, Field, required } from '@angular/forms/signals';
import { CreateAssignmentData } from '../../interfaces/create-assignment-data';
import { AssignmentService } from '../../../services/assignment-service';
import { LabService } from '../../../services/lab-service';
import { UsersService } from '../../../users/services/users-service';
import { AnalysisTypeService } from '../../../services/analysis-type-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignment-form',
  imports: [SubmitButton, FieldErrors, Field],
  templateUrl: './assignment-form.html'
})
export class AssignmentForm {
  id = input<string>();

  assignmentService = inject(AssignmentService);
  labService = inject(LabService);
  usersService = inject(UsersService);
  analysisTypeService = inject(AnalysisTypeService);
  router = inject(Router);
  assignmentResource = this.assignmentService.getAssigmentById(this.id);

  private readonly emptyAssignmentModel: CreateAssignmentData = {
    analysisId: '',
    labId: '',
    appointmentDate: new Date(),
    patientUserId: '',
    status: 'SCHEDULED'
  };

  protected assignmentModel = linkedSignal<CreateAssignmentData>(() => {
    const assignment = this.assignmentResource.value();

    if (!assignment)
      return this.emptyAssignmentModel

    return {
      analysisId: assignment.analysisId,
      appointmentDate: new Date(assignment.appointmentDate),
      labId: assignment.labId,
      patientUserId: assignment.patientUserId,
      status: assignment.status
    }
  });

  protected form = form(this.assignmentModel, (p) => {
    required(p.analysisId);
    required(p.appointmentDate);
    required(p.patientUserId);
    required(p.labId);
  })

  isSubmitting = signal(false);
    errorMessage = signal('');
  
    async sendRequest(event: Event) {
      event.preventDefault();
      if (!this.form().valid()) return;
      
      this.errorMessage.set('');
      this.isSubmitting.set(true);
  
      if (!this.id())
        await this.createAssignment(this.form().value());
  
      if (this.id())
        await this.updateAssignment(this.id()!, this.form().value());
  
      this.isSubmitting.set(false);

      if (this.errorMessage() == '')
      {
        this.assignmentService.assignmentsResource.reload();
        alert('¡Operación exitosa!')
        this.router.navigate(['/admin/assignments']);
      }
    }
  
    private async createAssignment(assignment: CreateAssignmentData) {
      try {
        const response = await this.assignmentService.createAssignment(assignment);
      } catch (error) {
        debugger;
        this.errorMessage.set('Ocurrió un error al crear la asignación. Intente de nuevo');
      }
    }
  
    private async updateAssignment(id: string, assignment: CreateAssignmentData) {
      try {
        const response = await this.assignmentService.updateAssignment(id, assignment);
      } catch (error) {
        debugger;
        this.errorMessage.set('Ocurrió un error al actualizar la asignación. Intente de nuevo');
      }
    }
}
