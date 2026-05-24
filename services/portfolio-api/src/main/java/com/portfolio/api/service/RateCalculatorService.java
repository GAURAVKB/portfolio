package com.portfolio.api.service;

import com.portfolio.api.dto.RateRequest;
import com.portfolio.api.dto.RateResponse;
import org.springframework.stereotype.Service;

@Service
public class RateCalculatorService {

    private static final int BASE_RATE_PER_WEEK = 2000;

    public RateResponse calculate(RateRequest req) {
        int base = BASE_RATE_PER_WEEK * req.timelineWeeks();

        double multiplier = switch (req.projectType().toLowerCase()) {
            case "enterprise" -> 1.8;
            case "startup"    -> 1.3;
            case "mvp"        -> 1.1;
            default           -> 1.0;
        };

        double stackBonus = req.techStack().toLowerCase().contains("java")
            || req.techStack().toLowerCase().contains("spring") ? 1.15 : 1.0;

        int devOpsAddon  = req.includesDevOps()  ? 1500 : 0;
        int designAddon  = req.includesDesign()  ? 1000 : 0;

        int min = (int) (base * multiplier * stackBonus) + devOpsAddon + designAddon;
        int max = (int) (min * 1.25);

        String breakdown = "Base (%d weeks × $%d) + stack bonus + addons".formatted(
            req.timelineWeeks(), BASE_RATE_PER_WEEK
        );

        return new RateResponse(min, max, "USD", breakdown,
            "Estimates are indicative. Final rate after scoping call.");
    }
}
