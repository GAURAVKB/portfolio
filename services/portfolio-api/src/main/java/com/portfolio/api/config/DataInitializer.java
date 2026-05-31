package com.portfolio.api.config;

import com.portfolio.api.entity.AdminUser;
import com.portfolio.api.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Bean
    CommandLineRunner initAdmin() {
        return args -> {
            var existing = adminUserRepository.findByUsername("admin");
            if (existing.isEmpty()) {
                AdminUser admin = new AdminUser();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode(adminPassword));
                adminUserRepository.save(admin);
                log.info("=== Admin user created: username=admin ===");
            } else {
                // Always sync password to whatever ADMIN_PASSWORD env var says
                existing.ifPresent(user -> {
                    if (!passwordEncoder.matches(adminPassword, user.getPassword())) {
                        user.setPassword(passwordEncoder.encode(adminPassword));
                        adminUserRepository.save(user);
                        log.info("=== Admin password updated from ADMIN_PASSWORD env var ===");
                    } else {
                        log.info("=== Admin user OK ===");
                    }
                });
            }
        };
    }
}
