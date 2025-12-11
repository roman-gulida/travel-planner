package com.travelapp.travelplanner.user.service;

import com.travelapp.travelplanner.config.JwtProvider;
import com.travelapp.travelplanner.exceptions.BadRequestException;
import com.travelapp.travelplanner.user.dto.AuthResponse;
import com.travelapp.travelplanner.user.dto.LoginRequest;
import com.travelapp.travelplanner.user.model.User;
import com.travelapp.travelplanner.user.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!user.isActive()) {
            throw new BadRequestException("User is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtProvider.generateToken(user.getId(), user.getRole().name());
        return new AuthResponse(token);
    }
}
