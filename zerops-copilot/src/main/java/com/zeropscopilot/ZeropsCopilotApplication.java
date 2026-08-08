package com.zeropscopilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ZeropsCopilotApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZeropsCopilotApplication.class, args);
    }

}