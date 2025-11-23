import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateAnalysisResult } from '../interfaces/create-analysis-result';
import { environment } from '../../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AnalysisResultResponse } from '../interfaces/analysis-result-response';

@Injectable({
  providedIn: 'root',
})
export class AnalysisResultService {
  private readonly API_URL = environment.API.ANALYSIS_URL;
  private readonly http = inject(HttpClient);

  createAnalysisResult(request: CreateAnalysisResult) {
    return firstValueFrom(this.http.post<AnalysisResultResponse>(`${this.API_URL}/analysis-results`, request));
  }

  getAnalysisById(idSignal: () => string | undefined) {
    return httpResource<AnalysisResultResponse>(() => {
      const id = idSignal();
      return id ? `${this.API_URL}/analysis-results/${id}` : undefined;
    });
  }

  getAnalysisByAssignmentId(idSignal: () => string | undefined) {
    return httpResource<AnalysisResultResponse>(() => {
      const id = idSignal();
      return id ? `${this.API_URL}/analysis-results/assignment/${id}` : undefined;
    });
  }
}
