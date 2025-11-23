import { Routes } from "@angular/router";

export const USERS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/users-list/users-list').then(m => m.UsersList)
    },
    {
        path: 'new',
        loadComponent: () => import('./pages/user-form/user-form').then(m => m.UserForm)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/user-form/user-form').then(m => m.UserForm)
    }
];