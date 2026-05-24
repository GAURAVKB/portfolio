package com.portfolio.api.controller;

import com.portfolio.api.dto.RateRequest;
import com.portfolio.api.dto.RateResponse;
import com.portfolio.api.service.RateCalculatorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rate-calculator")
@RequiredArgsConstructor
public class RateCalculatorController {

    private final RateCalculatorService rateCalculatorService;

    @PostMapping
    public RateResponse calculate(@Valid @RequestBody RateRequest request) {
        return rateCalculatorService.calculate(request);
    }
}
