import { Routes } from "@angular/router";

export const ASSIGNMENT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/assignments-list/assignments-list').then(m => m.AssignmentsList)
    },
    {
        path: 'new',
        loadComponent: () => import('./pages/assignment-form/assignment-form').then(m => m.AssignmentForm)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/assignment-form/assignment-form').then(m => m.AssignmentForm)
    }
];