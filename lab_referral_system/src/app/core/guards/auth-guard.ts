import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!authService.getToken())
  {
    authService.logout();
    router.navigate(['/auth/login']);
    return false;
  }

  if (!authService.validateToken())
  {
    authService.logout();
    router.navigate(['/auth/login']);
    return false;
  }

  const role = authService.getRoleFromToken();

  if(role !== route.data['role'])
  {
    authService.logout();
    router.navigate(['/auth/login']);
    return false;
  }
  
  return true;
};
