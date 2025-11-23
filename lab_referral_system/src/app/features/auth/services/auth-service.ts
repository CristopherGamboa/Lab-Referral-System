import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { LoginData } from '../interfaces/login-data';
import { LoginResponse } from '../interfaces/login-response';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../interfaces/jwt-payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = environment.API.IDENTITY_URL;

  login(request: LoginData): Promise<LoginResponse> {
    return firstValueFrom(this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, request));
  }

  setToken(token: string)
  {
    localStorage.setItem('AUTH_TOKEN', token);
  }

  getToken()
  {
    return localStorage.getItem('AUTH_TOKEN');
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        // Asegúrate de que 'role' sea la propiedad correcta en tu JWT
        return decodedToken.userId; 
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        // Asegúrate de que 'role' sea la propiedad correcta en tu JWT
        return decodedToken.roles; 
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  getLabFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        // Asegúrate de que 'role' sea la propiedad correcta en tu JWT
        return decodedToken.labId; 
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  validateToken(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        
        if (decodedToken.exp < Date.now() / 1000) {
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return false;
      }
    }
    return false;
  }

  logout()
  {
    localStorage.removeItem('AUTH_TOKEN');

    this.router.navigate(['/auth/login']);
  }
}
