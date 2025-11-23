package com.example.lab_identity_service.lab_identity_service.services;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.lab_identity_service.lab_identity_service.dtos.UserRequestDTO;
import com.example.lab_identity_service.lab_identity_service.dtos.UserResponseDTO;
import com.example.lab_identity_service.lab_identity_service.exceptions.UserAlreadyExistsException;
import com.example.lab_identity_service.lab_identity_service.exceptions.ResourceNotFoundException;
import com.example.lab_identity_service.lab_identity_service.models.Role;
import com.example.lab_identity_service.lab_identity_service.models.User;
import com.example.lab_identity_service.lab_identity_service.repositories.IUserRepository;
import com.example.lab_identity_service.lab_identity_service.services.interfaces.IUserService;
import com.example.lab_identity_service.lab_identity_service.repositories.IRoleRepository;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Crea un nuevo usuario: hashea la contraseña, valida roles y guarda.
     * @param requestDTO El DTO con los datos del nuevo usuario.
     * @return UserResponseDTO con el usuario creado.
     */
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO requestDTO) throws ResourceNotFoundException {
        
        // Validación de existencia
        if (userRepository.findByEmail(requestDTO.getEmail()).isPresent()) {            
            throw new UserAlreadyExistsException("User with email " + requestDTO.getEmail() + " already exists.");
        }

        // Hash de la Contraseña
        String hashedPassword = passwordEncoder.encode(requestDTO.getPassword());

        // Recuperación y Validación de Roles
        Role role = roleRepository.findByName(requestDTO.getRole())
            .orElseThrow(() -> 
                new ResourceNotFoundException("Role not found: " 
                + requestDTO.getRole()));

        boolean isTechnician = requestDTO.getRole().equals("TECHNICIAN");

        if (isTechnician && requestDTO.getLabId() == null) {
            throw new IllegalArgumentException("Lab ID is required for a TECHNICIAN role.");
        }
        if (!isTechnician && requestDTO.getLabId() != null) {
            requestDTO.setLabId(null); 
        }
        
        // Mapeo DTO a Entidad (User)
        User user = User.builder()
                .fullName(requestDTO.getFullName())
                .email(requestDTO.getEmail())
                .passwordHash(hashedPassword)
                .isActive(requestDTO.getIsActive() != null ? requestDTO.getIsActive() : "Y") // Default 'Y'
                .createdAt(ZonedDateTime.now())
                .roles(Set.of(role))
                .labId(requestDTO.getLabId())
                .build();

        // Guardar en Base de Datos
        User savedUser = userRepository.save(user);

        // Mapeo Entidad a DTO de Respuesta
        return mapToResponseDTO(savedUser);
    }

    /**
     * Recupera un usuario por su ID.
     * @param userId El ID del usuario.
     * @return UserResponseDTO con los datos del usuario.
     */
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        return mapToResponseDTO(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> user.getRoles()
                    .stream()
                    .anyMatch(
                        role -> role.getName().equals("PATIENT") || 
                        role.getName().equals("TECHNICIAN")
                    )
                )
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllPatients() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> user.getRoles()
                    .stream()
                    .anyMatch(
                        role -> role.getName().equals("PATIENT")
                    )
                )
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Actualiza la información de un usuario existente.
     * @param userId El ID del usuario a modificar.
     * @param requestDTO Los nuevos datos del usuario (puede incluir la nueva contraseña).
     * @return UserResponseDTO con el usuario modificado.
     */
    @Transactional
    public UserResponseDTO updateUser(Long userId, UserRequestDTO requestDTO) {
        
        // Encontrar usuario existente
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Comprobar unicidad del email si se intenta cambiar
        if (!existingUser.getEmail().equals(requestDTO.getEmail()) && 
            userRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email " + requestDTO.getEmail() + " is already in use by another user.");
        }

        // Actualizar campos
        existingUser.setFullName(requestDTO.getFullName());
        existingUser.setEmail(requestDTO.getEmail());

        if (requestDTO.getIsActive() != null)
            existingUser.setIsActive(requestDTO.getIsActive());

        // Actualizar Contraseña (Opcional): Solo si se proporciona una nueva contraseña
        if (requestDTO.getPassword() != null && !requestDTO.getPassword().trim().isEmpty()) {
            String newHashedPassword = passwordEncoder.encode(requestDTO.getPassword());
            existingUser.setPasswordHash(newHashedPassword);
        }

        // Actualizar Roles
        Role newRole = roleRepository.findByName(requestDTO.getRole())
            .orElseThrow(() -> 
                new ResourceNotFoundException("Role not found: " 
                + requestDTO.getRole()));
            
        existingUser.setRoles(new HashSet<>(Set.of(newRole)));

        // Guardar y retornar
        User updatedUser = userRepository.save(existingUser);
        
        return mapToResponseDTO(updatedUser);
    }

    /**
     * Elimina un usuario por su ID.
     * @param userId El ID del usuario a eliminar.
     */
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }
    
    // Método auxiliar para mapear la entidad a la respuesta DTO
    private UserResponseDTO mapToResponseDTO(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
                
        return UserResponseDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .roles(roleNames)
                .labId(user.getLabId())
                .build();
    }
}