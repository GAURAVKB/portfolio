package com.portfolio.api.service;

import com.portfolio.api.dto.ContactRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.mail.admin-email}")
    private String adminEmail;

    @Async
    public void sendContactNotification(ContactRequest req) {
        try {
            var msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(adminEmail);
            msg.setSubject("[Portfolio] New message from " + req.name() + ": " + req.subject());
            msg.setText("""
                Name:    %s
                Email:   %s
                Subject: %s

                Message:
                %s
                """.formatted(req.name(), req.email(), req.subject(), req.message()));
            mailSender.send(msg);
            log.info("Contact notification sent for {}", req.email());
        } catch (Exception e) {
            log.error("Failed to send contact email", e);
        }
    }
}
