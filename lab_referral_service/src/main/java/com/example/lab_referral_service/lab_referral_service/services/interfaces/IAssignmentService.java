package com.example.lab_referral_service.lab_referral_service.services.interfaces;

import java.util.List;
import java.util.Set;

import com.example.lab_referral_service.lab_referral_service.dtos.AssignmentRequestDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.AssignmentResponseDTO;

public interface IAssignmentService {
    AssignmentResponseDTO createAssignment(AssignmentRequestDTO requestDTO);
    AssignmentResponseDTO getAssignmentById(Long assignmentId);
    List<AssignmentResponseDTO> getAssignmentsByLabId(Long labId);
    List<AssignmentResponseDTO> getAllAssignments();
    AssignmentResponseDTO updateAssignmentStatus(Long assignmentId, String status);
    AssignmentResponseDTO updateAssignment(Long assignmentId, AssignmentRequestDTO requestDTO);
    void deleteAssignment(Long assignmentId);
}
