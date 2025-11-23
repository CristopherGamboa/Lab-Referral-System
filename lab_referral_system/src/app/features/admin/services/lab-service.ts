import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { LaboratoryResponse } from '../interfaces/laboratory-response';

@Injectable({
  providedIn: 'root',
})
export class LabService {
  private readonly API_URL = environment.API.REFERRAL_URL;

  readonly labResource = httpResource<LaboratoryResponse[]>(() => `${this.API_URL}/catalog/laboratories`)
}
