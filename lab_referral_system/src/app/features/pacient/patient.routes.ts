import { Routes } from "@angular/router";

export const PATIENT_ROUTES: Routes = [
    {
        path: 'results',
        loadComponent: () => import('./pages/check-analysis/check-analysis').then(m => m.CheckAnalysis)
    }
]
    