import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { TECHNICIAN_ROUTES } from './features/technician/technician.routes';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [authGuard],
        data: { role: 'ROLE_ADMIN' }
    },
    {
        path: 'technician',
        loadChildren: () => import('./features/technician/technician.routes').then(m => TECHNICIAN_ROUTES),
        canActivate: [authGuard],
        data: { role: 'ROLE_TECHNICIAN' }
    },
    {
        path: 'patient',
        loadChildren: () => import('./features/pacient/patient.routes').then(m => m.PATIENT_ROUTES)
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];
