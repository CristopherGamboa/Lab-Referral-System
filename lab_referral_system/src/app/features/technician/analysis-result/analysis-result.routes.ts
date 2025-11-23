import { Routes } from "@angular/router";

export const ANALYSIS_RESULT_ROUTES: Routes = [
    {
        path: 'assignments',
        loadComponent: () => import('./pages/lab-assignments/lab-assignments').then(m => m.LabAssignments)
    },
    {
        path: 'assignment/:assignmentId/analysis',
        loadComponent: () => import('./pages/analysis-result-form/analysis-result-form').then(m => m.AnalysisResultForm)
    }
]
    