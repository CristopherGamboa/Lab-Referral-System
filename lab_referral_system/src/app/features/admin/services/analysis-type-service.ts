import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { AnalysisTypeResponse } from '../interfaces/analysis-type-response';

@Injectable({
  providedIn: 'root',
})
export class AnalysisTypeService {
  private readonly API_URL = environment.API.REFERRAL_URL;
  
  readonly analysisTypeResource = httpResource<AnalysisTypeResponse[]>(() => `${this.API_URL}/catalog/analysis`);
}
