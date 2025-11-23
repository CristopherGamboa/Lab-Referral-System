export interface AssignmentResponse {
    id: string,
    patientUserId: string,
    labId: string,
    labName: string, 
    analysisId: string,
    analysisName: string, 
    requestDate: Date
    appointmentDate: Date
    status: string
}
