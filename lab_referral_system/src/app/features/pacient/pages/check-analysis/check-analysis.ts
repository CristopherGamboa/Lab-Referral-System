import { Component, computed, inject, signal } from '@angular/core';
import { form, pattern, required, Field, min } from '@angular/forms/signals';
import { AnalysisResultService } from '../../../technician/analysis-result/services/analysis-result-service';
import { FieldErrors } from "../../../../shared/components/forms/field-errors/field-errors";

@Component({
  selector: 'app-check-analysis',
  imports: [Field, FieldErrors],
  templateUrl: './check-analysis.html',})
export class CheckAnalysis {
  analysisService = inject(AnalysisResultService);
  
  searchModel = signal<{s: string}>({
    s: ''
  });
  searchForm = form(this.searchModel, (p) => {
    required(p.s)
    pattern(p.s, RegExp('^[0-9]+$'));
    min(p.s, 0);
  });
  
  analysisId = computed(() => {
    if (!this.searchForm().valid())
      return undefined;

    return this.searchModel().s;
  });
  analysisResource = this.analysisService.getAnalysisByAssignmentId(this.analysisId);
  
  isSubmitting = signal(false);
} 
