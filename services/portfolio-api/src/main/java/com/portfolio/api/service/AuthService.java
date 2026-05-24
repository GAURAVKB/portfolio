package com.portfolio.api.service;

import com.portfolio.api.dto.JwtResponse;
import com.portfolio.api.dto.LoginRequest;
import com.portfolio.api.repository.AdminUserRepository;
import com.portfolio.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public JwtResponse login(LoginRequest request) {
        var user = adminUserRepository.findByUsername(request.username())
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return new JwtResponse(jwtUtil.generateToken(user.getUsername()), user.getUsername());
    }
}
