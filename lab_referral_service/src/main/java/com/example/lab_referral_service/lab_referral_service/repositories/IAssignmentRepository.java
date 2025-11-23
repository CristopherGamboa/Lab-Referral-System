package com.example.lab_referral_service.lab_referral_service.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.lab_referral_service.lab_referral_service.models.Assignment;

public interface IAssignmentRepository extends JpaRepository<Assignment, Long> {
    @Query("SELECT a FROM Assignment a WHERE a.laboratory.id = :labId")
    public List<Assignment> findByLabId(Long labId);    
}
