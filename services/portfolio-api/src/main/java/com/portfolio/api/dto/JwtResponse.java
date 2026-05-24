package com.portfolio.api.dto;

public record JwtResponse(String token, String type, String username) {
    public JwtResponse(String token, String username) {
        this(token, "Bearer", username);
    }
}
