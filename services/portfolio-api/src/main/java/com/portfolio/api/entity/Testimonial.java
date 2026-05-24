package com.portfolio.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "testimonials")
public class Testimonial {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String role;
    private String company;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    private String avatarUrl;
    private Boolean visible = true;
}
