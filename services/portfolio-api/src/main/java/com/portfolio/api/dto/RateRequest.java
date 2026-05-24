package com.portfolio.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record RateRequest(
    @NotBlank String projectType,
    @NotBlank String techStack,
    @Min(1) int timelineWeeks,
    boolean includesDevOps,
    boolean includesDesign
) {}
