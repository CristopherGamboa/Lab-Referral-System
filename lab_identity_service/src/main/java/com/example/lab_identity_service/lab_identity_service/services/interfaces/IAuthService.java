package com.example.lab_identity_service.lab_identity_service.services.interfaces;

import com.example.lab_identity_service.lab_identity_service.dtos.LoginDTO;
import com.example.lab_identity_service.lab_identity_service.dtos.LoginResponseDTO;

public interface IAuthService {
    LoginResponseDTO login(LoginDTO loginDTO);
}
