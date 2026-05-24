package com.portfolio.api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "contacts")
public class Contact {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String email;
    private String subject;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    private Boolean read = false;
    private Instant createdAt = Instant.now();
}
