package com.portfolio.api.dto;

public record RateResponse(
    int minRate,
    int maxRate,
    String currency,
    String breakdown,
    String disclaimer
) {}
