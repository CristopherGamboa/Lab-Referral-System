import { Routes } from "@angular/router";

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/admin-layout/admin-layout').then(m => m.AdminLayout),
        children: [
            {
                path: 'users',
                loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES)
            },
            {
                path: 'assignments',
                loadChildren: () => import('./assignments/assignment.routes').then(m => m.ASSIGNMENT_ROUTES)
            }
        ]
    }
];