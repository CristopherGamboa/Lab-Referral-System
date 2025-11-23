package com.example.lab_referral_service.lab_referral_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.lab_referral_service.lab_referral_service.models.Laboratory;

public interface ILaboratoryRepository extends JpaRepository<Laboratory, Long> {}
