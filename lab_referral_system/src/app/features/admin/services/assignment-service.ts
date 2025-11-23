import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { AssignmentResponse } from '../interfaces/assigment-response';
import { CreateAssignmentData } from '../assignments/interfaces/create-assignment-data';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private readonly API_URL = environment.API.REFERRAL_URL;
  private readonly http = inject(HttpClient);
  
  readonly assignmentsResource = httpResource<AssignmentResponse[]>(() => `${this.API_URL}/assignments`);

  getAssignmentsByLabId(idSignal: () => string | undefined) {
    return httpResource<AssignmentResponse[]>(() => {
      const id = idSignal();
      return id ? `${this.API_URL}/assignments/lab/${id}` : undefined;
    });
  }

  getAssigmentById(idSignal: () => string | undefined) {
    return httpResource<AssignmentResponse>(() => {
      const id = idSignal();
      return id ? `${this.API_URL}/assignments/${id}` : undefined;
    });
  }

  createAssignment(request: CreateAssignmentData)
  {
    return firstValueFrom(this.http.post<AssignmentResponse>(`${this.API_URL}/assignments`, request));
  }

  updateAssignment(id: string, request: CreateAssignmentData)
  {
    return firstValueFrom(this.http.put<AssignmentResponse>(`${this.API_URL}/assignments/${id}`, request));
  }

  updateAssignmentStatusToComplete(id: string)
  {
    return firstValueFrom(this.http.put<AssignmentResponse>(`${this.API_URL}/assignments/${id}/status?status=COMPLETED`, {}));
  }

  deleteAssignment(id: string)
  {
    return firstValueFrom(this.http.delete<void>(`${this.API_URL}/assignments/${id}`));
  }
}
