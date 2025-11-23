export interface AnalysisResultResponse {
    id: string;
    analysisType: string;
    patientId: string;
    assignmentId: string;
    technicianId: string;
    result: string;
    analysisDate: Date;
    notes: string;
} 