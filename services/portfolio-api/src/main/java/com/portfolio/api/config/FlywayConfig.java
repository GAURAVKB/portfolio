package com.portfolio.api.config;

import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class FlywayConfig {

    /**
     * Automatically repairs Flyway checksum mismatches before migrating.
     * This handles the case where a migration file is edited after being applied
     * (common during development). In production, edit migration files with care.
     */
    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            try {
                flyway.migrate();
            } catch (Exception e) {
                if (e.getMessage() != null && e.getMessage().contains("checksum mismatch")) {
                    log.warn("Flyway checksum mismatch detected — running repair then retrying migrate");
                    flyway.repair();
                    flyway.migrate();
                } else {
                    throw e;
                }
            }
        };
    }
}
