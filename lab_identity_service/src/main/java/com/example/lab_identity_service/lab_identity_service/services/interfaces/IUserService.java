package com.example.lab_identity_service.lab_identity_service.services.interfaces;

import java.util.List;

import com.example.lab_identity_service.lab_identity_service.dtos.UserRequestDTO;
import com.example.lab_identity_service.lab_identity_service.dtos.UserResponseDTO;

public interface IUserService {
    UserResponseDTO createUser(UserRequestDTO requestDTO);
    UserResponseDTO getUserById(Long userId);
    List<UserResponseDTO> getAllUsers();
    List<UserResponseDTO> getAllPatients();
    UserResponseDTO updateUser(Long userId, UserRequestDTO requestDTO);
    void deleteUser(Long userId);
}
