package com.zeropscopilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "deployment_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeploymentLog extends BaseEntity {

    public enum LogLevel {
        INFO, WARN, ERROR, DEBUG
    }

    @NotBlank(message = "Log message cannot be blank")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LogLevel level = LogLevel.INFO;

    @Column(name = "timestamp", nullable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id", nullable = false)
    private DeploymentStage stage;
}
