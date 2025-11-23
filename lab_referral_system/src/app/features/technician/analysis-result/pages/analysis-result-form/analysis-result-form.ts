import { Component, inject, input, linkedSignal, signal } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth-service';
import { AssignmentService } from '../../../../admin/services/assignment-service';
import { CreateAnalysisResult } from '../../interfaces/create-analysis-result';
import { Field, form, required } from '@angular/forms/signals';
import { FieldErrors } from "../../../../../shared/components/forms/field-errors/field-errors";
import { SubmitButton } from "../../../../../shared/components/forms/submit-button/submit-button";
import { AnalysisResultService } from '../../services/analysis-result-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analysis-result-form',
  imports: [FieldErrors, Field, SubmitButton],
  templateUrl: './analysis-result-form.html'
})
export class AnalysisResultForm {
  assignmentId = input.required<string>(); 
  authService = inject(AuthService);
  router = inject(Router);
  assignmentService = inject(AssignmentService);
  analysisResultService = inject(AnalysisResultService);

  assignmentResource = this.assignmentService.getAssigmentById(this.assignmentId);

  private readonly emptyAnalysisResultModel: CreateAnalysisResult = {
    analysisDate: new Date(),
    analysisType: '',
    assignmentId: '',
    notes: '',
    patientId: '',
    result: '',
    technicianId: ''
  }

  protected analysisModel = linkedSignal<CreateAnalysisResult>(() => {
    const assignment = this.assignmentResource.value();
    const userId = this.authService.getUserIdFromToken()
    if (!assignment)
      return this.emptyAnalysisResultModel

    return {
      analysisDate: new Date(),
      analysisType: assignment.analysisName,
      assignmentId: assignment.id,
      notes: '',
      patientId: assignment.patientUserId,
      result: '',
      technicianId: userId || ''
    }
  });

  protected form = form(this.analysisModel, (p) => {
    required(p.analysisDate);
    required(p.analysisType);
    required(p.assignmentId);
    required(p.notes);
    required(p.patientId);
    required(p.result);
    required(p.technicianId);
  })

  isSubmitting = signal(false);
  errorMessage = signal('');

  async sendRequest(event: Event) {
    event.preventDefault();
    if (!this.form().valid())
      return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    await this.createAnalysisResult(this.form().value());
    await this.updateAssignmentStatus(this.assignmentId());

    this.isSubmitting.set(true);

    if (this.errorMessage() == '')
    {
      alert('¡Operación exitosa!')
      this.router.navigate(['/technician/assignments']);
    }
  }

  private async createAnalysisResult(analysisResult: CreateAnalysisResult) {
    try {
      const response = await this.analysisResultService.createAnalysisResult(analysisResult);
    } catch (error) {
      this.errorMessage.set('Ocurrió un error al crear el análisis. Intente de nuevo');
    }
  }

  private async updateAssignmentStatus(id: string) {
    try {
      const response = await this.assignmentService.updateAssignmentStatusToComplete(id);
    } catch (error) {
      this.errorMessage.set('Ocurrió un error al actualizar la asignación. Intente de nuevo');
    }
  }
}
