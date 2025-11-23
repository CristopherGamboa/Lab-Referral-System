package com.example.lab_referral_service.lab_referral_service.controllers;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.lab_referral_service.lab_referral_service.dtos.AssignmentRequestDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.AssignmentResponseDTO;
import com.example.lab_referral_service.lab_referral_service.services.interfaces.IAssignmentService;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final IAssignmentService assignmentService;

    // Solo TECHNICIANs y ADMINs pueden crear asignaciones.
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public ResponseEntity<AssignmentResponseDTO> createAssignment(@Valid @RequestBody AssignmentRequestDTO requestDTO) {
        AssignmentResponseDTO newAssignment = assignmentService.createAssignment(requestDTO);
        return new ResponseEntity<>(newAssignment, HttpStatus.CREATED);
    }
    
    // Solo el ADMIN o el TECHNICIAN pueden consultar cualquier asignación.
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')") 
    public ResponseEntity<AssignmentResponseDTO> getAssignmentById(@PathVariable Long id) {
        AssignmentResponseDTO assignment = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(assignment);
    }

    @GetMapping("/lab/{labId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public ResponseEntity<List<AssignmentResponseDTO>> getAssignmentsByLabId(@PathVariable Long labId) {
        List<AssignmentResponseDTO> assignments = assignmentService.getAssignmentsByLabId(labId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping()
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public ResponseEntity<List<AssignmentResponseDTO>> getAllAssignments() {
        List<AssignmentResponseDTO> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public ResponseEntity<AssignmentResponseDTO> updateAssignment(@PathVariable Long id, @Valid @RequestBody AssignmentRequestDTO requestDTO) {
        AssignmentResponseDTO updatedAssignment = assignmentService.updateAssignment(id, requestDTO);
        return ResponseEntity.ok(updatedAssignment);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public ResponseEntity<AssignmentResponseDTO> updateAssignmentStatus(@PathVariable Long id, @RequestParam String status) {
        AssignmentResponseDTO updatedAssignment = assignmentService.updateAssignmentStatus(id, status);
        return ResponseEntity.ok(updatedAssignment);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Solo el ADMIN puede eliminar asignaciones
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
