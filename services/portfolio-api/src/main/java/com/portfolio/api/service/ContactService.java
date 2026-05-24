package com.portfolio.api.service;

import com.portfolio.api.dto.ContactRequest;
import com.portfolio.api.entity.Contact;
import com.portfolio.api.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final EmailService emailService;

    @Transactional
    public void submit(ContactRequest req) {
        var contact = new Contact();
        contact.setName(req.name());
        contact.setEmail(req.email());
        contact.setSubject(req.subject());
        contact.setMessage(req.message());
        contactRepository.save(contact);
        emailService.sendContactNotification(req);
    }

    public Page<Contact> list(Pageable pageable) {
        return contactRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional
    public void markRead(Long id) {
        contactRepository.findById(id).ifPresent(c -> {
            c.setRead(true);
            contactRepository.save(c);
        });
    }

    public long unreadCount() {
        return contactRepository.countByReadFalse();
    }
}
