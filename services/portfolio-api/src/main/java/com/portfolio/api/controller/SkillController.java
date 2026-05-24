package com.portfolio.api.controller;

import com.portfolio.api.entity.Skill;
import com.portfolio.api.repository.SkillRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillRepository skillRepository;

    @GetMapping
    public List<Skill> list() {
        return skillRepository.findAllByOrderByCategoryAscSortOrderAsc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Skill create(@Valid @RequestBody Skill skill) {
        skill.setId(null);
        return skillRepository.save(skill);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> update(@PathVariable Long id, @Valid @RequestBody Skill skill) {
        if (!skillRepository.existsById(id)) return ResponseEntity.notFound().build();
        skill.setId(id);
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        skillRepository.deleteById(id);
    }
}
