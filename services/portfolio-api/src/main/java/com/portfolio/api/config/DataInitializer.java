package com.portfolio.api.config;

import com.portfolio.api.entity.AdminUser;
import com.portfolio.api.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @Bean
    CommandLineRunner initAdmin() {
        return args -> {
            if (adminUserRepository.findByUsername("admin").isEmpty()) {
                AdminUser admin = new AdminUser();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                adminUserRepository.save(admin);
                log.info("=== Admin user created: username=admin password=admin123 ===");
                log.info("=== CHANGE THIS PASSWORD before going to production!      ===");
            } else {
                // Fix the password — ensures it always matches admin123 on startup
                adminUserRepository.findByUsername("admin").ifPresent(user -> {
                    if (!passwordEncoder.matches("admin123", user.getPassword())) {
                        user.setPassword(passwordEncoder.encode("admin123"));
                        adminUserRepository.save(user);
                        log.info("=== Admin password reset to admin123 ===");
                    } else {
                        log.info("=== Admin user OK — login with admin / admin123 ===");
                    }
                });
            }
        };
    }
}
