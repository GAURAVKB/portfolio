package com.portfolio.api.controller;

import com.portfolio.api.entity.Testimonial;
import com.portfolio.api.repository.TestimonialRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/testimonials")
@RequiredArgsConstructor
public class TestimonialController {

    private final TestimonialRepository testimonialRepository;

    @GetMapping
    public List<Testimonial> list() {
        return testimonialRepository.findByVisibleTrue();
    }

    @GetMapping("/all")
    public List<Testimonial> listAll() {
        return testimonialRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Testimonial create(@Valid @RequestBody Testimonial testimonial) {
        testimonial.setId(null);
        return testimonialRepository.save(testimonial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Testimonial> update(@PathVariable Long id, @Valid @RequestBody Testimonial testimonial) {
        if (!testimonialRepository.existsById(id)) return ResponseEntity.notFound().build();
        testimonial.setId(id);
        return ResponseEntity.ok(testimonialRepository.save(testimonial));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        testimonialRepository.deleteById(id);
    }
}
