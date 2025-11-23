import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateUserData } from '../interfaces/create-user-data';
import { firstValueFrom } from 'rxjs';
import { UserResponse } from '../interfaces/user-response';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = environment.API.IDENTITY_URL;
  private readonly http = inject(HttpClient);
  
  readonly usersResource = httpResource<UserResponse[]>(() => `${this.API_URL}/users`);
  readonly patientsResource = httpResource<UserResponse[]>(() => `${this.API_URL}/users/patients`);

  createUser(request: CreateUserData): Promise<UserResponse> {
    return firstValueFrom(this.http.post<UserResponse>(`${this.API_URL}/users`, request));
  }

  getUserById(idSignal: () => string | undefined) {
    return httpResource<UserResponse>(() => {
      const id = idSignal();
      return id ? `${this.API_URL}/users/${id}` : undefined;
    });
  }

  updateUser(id: string, request: CreateUserData): Promise<UserResponse> {
    return firstValueFrom(this.http.put<UserResponse>(`${this.API_URL}/users/${id}`, request));
  }

  deleteUser(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.API_URL}/users/${id}`));
  }
}
