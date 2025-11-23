import { Routes } from "@angular/router";

export const TECHNICIAN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/technician-layout/technician-layout').then(m => m.TechnicianLayout),
        loadChildren: () => import('./analysis-result/analysis-result.routes').then(m => m.ANALYSIS_RESULT_ROUTES)
    }
]
    