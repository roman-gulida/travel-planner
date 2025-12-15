package com.travelapp.travelplanner.user.controller;

import com.travelapp.travelplanner.user.dto.AuthResponse;
import com.travelapp.travelplanner.user.dto.LoginRequest;
import com.travelapp.travelplanner.user.dto.RegisterRequest;
import com.travelapp.travelplanner.user.dto.UserDTO;
import com.travelapp.travelplanner.user.service.AuthService;
import com.travelapp.travelplanner.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    public AuthController(UserService userService,
                          AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterRequest request) {
        UserDTO user = userService.register(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
