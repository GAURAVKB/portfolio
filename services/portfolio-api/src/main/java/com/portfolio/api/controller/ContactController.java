package com.portfolio.api.controller;

import com.portfolio.api.dto.ContactRequest;
import com.portfolio.api.entity.Contact;
import com.portfolio.api.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Map<String, String> submit(@Valid @RequestBody ContactRequest request) {
        contactService.submit(request);
        return Map.of("message", "Your message has been received. I'll get back to you shortly!");
    }

    @GetMapping
    public Page<Contact> list(@PageableDefault(size = 20) Pageable pageable) {
        return contactService.list(pageable);
    }

    @PatchMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markRead(@PathVariable Long id) {
        contactService.markRead(id);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount() {
        return Map.of("count", contactService.unreadCount());
    }
}
