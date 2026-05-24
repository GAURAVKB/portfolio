package com.portfolio.api.controller;

import com.portfolio.api.entity.BlogPost;
import com.portfolio.api.repository.BlogPostRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogPostRepository blogPostRepository;

    @GetMapping
    public Page<BlogPost> list(@PageableDefault(size = 9, sort = "createdAt") Pageable pageable) {
        return blogPostRepository.findByPublishedTrue(pageable);
    }

    @GetMapping("/all")
    public Page<BlogPost> listAll(@PageableDefault(size = 20) Pageable pageable) {
        return blogPostRepository.findAll(pageable);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPost> getBySlug(@PathVariable String slug) {
        return blogPostRepository.findBySlugAndPublishedTrue(slug)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlogPost create(@Valid @RequestBody BlogPost post) {
        post.setId(null);
        return blogPostRepository.save(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> update(@PathVariable Long id, @Valid @RequestBody BlogPost post) {
        if (!blogPostRepository.existsById(id)) return ResponseEntity.notFound().build();
        post.setId(id);
        return ResponseEntity.ok(blogPostRepository.save(post));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        blogPostRepository.deleteById(id);
    }
}
