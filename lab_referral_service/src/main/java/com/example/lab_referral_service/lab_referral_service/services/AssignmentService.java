package com.example.lab_referral_service.lab_referral_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.lab_referral_service.lab_referral_service.client.UserServiceClient;
import com.example.lab_referral_service.lab_referral_service.dtos.AssignmentRequestDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.AssignmentResponseDTO;
import com.example.lab_referral_service.lab_referral_service.exceptions.ResourceNotFoundException;
import com.example.lab_referral_service.lab_referral_service.models.AnalysisType;
import com.example.lab_referral_service.lab_referral_service.models.Assignment;
import com.example.lab_referral_service.lab_referral_service.models.Laboratory;
import com.example.lab_referral_service.lab_referral_service.repositories.IAnalysisTypeRepository;
import com.example.lab_referral_service.lab_referral_service.repositories.IAssignmentRepository;
import com.example.lab_referral_service.lab_referral_service.repositories.ILaboratoryRepository;
import com.example.lab_referral_service.lab_referral_service.services.interfaces.IAssignmentService;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService implements IAssignmentService {

    private final IAssignmentRepository assignmentRepository;
    private final ILaboratoryRepository laboratoryRepository;
    private final IAnalysisTypeRepository analysisTypeRepository;
    private final UserServiceClient userServiceClient;

    /**
     * Crea y asigna un nuevo análisis a un paciente y laboratorio.
     */
    @Transactional
    public AssignmentResponseDTO createAssignment(AssignmentRequestDTO requestDTO) {

        // Validación de existencia del Paciente (Comunicación entre servicios)
        userServiceClient.validatePatientExists(requestDTO.getPatientUserId()); // Lanza excepción si no existe

        // Validación de Laboratorio y Análisis
        Laboratory lab = laboratoryRepository.findById(requestDTO.getLabId())
                .orElseThrow(() -> new ResourceNotFoundException("Laboratory not found with ID: " + requestDTO.getLabId()));

        AnalysisType analysis = analysisTypeRepository.findById(requestDTO.getAnalysisId())
                .orElseThrow(() -> new ResourceNotFoundException("Analysis Type not found with ID: " + requestDTO.getAnalysisId()));

        // Validación de Asignación (Asegurar que el laboratorio puede hacer el análisis)
        Optional<AnalysisType> availableAnalysis = lab.getAnalysisTypes().stream()
                .filter(a -> a.getId().equals(analysis.getId()))
                .findFirst();

        if (availableAnalysis.isEmpty()) {
            throw new IllegalArgumentException("Laboratory " + lab.getName() + " does not perform the requested analysis.");
        }
        
        // Mapeo y Creación de la Asignación
        Assignment assignment = Assignment.builder()
                .patientUserId(requestDTO.getPatientUserId())
                .laboratory(lab)
                .analysisType(analysis)
                .requestDate(ZonedDateTime.now())
                .appointmentDate(requestDTO.getAppointmentDate())
                .status("PENDING") // Estado inicial
                .build();

        Assignment savedAssignment = assignmentRepository.save(assignment);

        // Retornar DTO de Respuesta
        return mapToResponseDTO(savedAssignment);
    }

    public AssignmentResponseDTO getAssignmentById(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + assignmentId));
        return mapToResponseDTO(assignment);
    }

    public List<AssignmentResponseDTO> getAssignmentsByLabId(Long labId) {
        List<Assignment> assignments = assignmentRepository.findByLabId(labId);
        
        return assignments.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    } 

    public List<AssignmentResponseDTO> getAllAssignments() {
        List<Assignment> assignments = assignmentRepository.findAll();
        
        return assignments.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Modifica la fecha de la cita y/o el estado de una asignación existente.
     * @param assignmentId ID de la asignación a modificar.
     * @param requestDTO Datos a actualizar (fecha y estado).
     * @return DTO de respuesta de la asignación modificada.
     */
    @Transactional
    public AssignmentResponseDTO updateAssignment(Long assignmentId, AssignmentRequestDTO requestDTO) {
        
        // Encontrar asignación existente
        Assignment existingAssignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + assignmentId));

        // Actualizar campos mutables (fecha y estado)

        if (requestDTO.getAppointmentDate() != null) {
            existingAssignment.setAppointmentDate(requestDTO.getAppointmentDate());
        }
        
        // El estado se actualiza si se proporciona, de lo contrario, se mantiene.
        if (requestDTO.getStatus() != null && !requestDTO.getStatus().trim().isEmpty()) {
            existingAssignment.setStatus(requestDTO.getStatus());
        }

        // Guardar y retornar
        Assignment updatedAssignment = assignmentRepository.save(existingAssignment);
        
        return mapToResponseDTO(updatedAssignment);
    }

    @Transactional
    public AssignmentResponseDTO updateAssignmentStatus(Long assignmentId, String status) {
        // Encontrar asignación existente
        Assignment existingAssignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + assignmentId));

        existingAssignment.setStatus(status);

        Assignment updatedAssignment = assignmentRepository.save(existingAssignment);
        
        return mapToResponseDTO(updatedAssignment);
    }

    /**
     * Elimina una asignación por su ID.
     * @param assignmentId ID de la asignación a eliminar.
     */
    @Transactional
    public void deleteAssignment(Long assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResourceNotFoundException("Assignment not found with ID: " + assignmentId);
        }
                
        assignmentRepository.deleteById(assignmentId);
    }

    private AssignmentResponseDTO mapToResponseDTO(Assignment assignment) {
        return AssignmentResponseDTO.builder()
                .id(assignment.getId())
                .patientUserId(assignment.getPatientUserId())
                .labId(assignment.getLaboratory().getId())
                .labName(assignment.getLaboratory().getName())
                .analysisId(assignment.getAnalysisType().getId())
                .analysisName(assignment.getAnalysisType().getName())
                .requestDate(assignment.getRequestDate())
                .appointmentDate(assignment.getAppointmentDate())
                .status(assignment.getStatus())
                .build();
    }
}