package com.zeropscopilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "ai_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiAnalysis extends BaseEntity {

    @NotBlank(message = "Root Cause cannot be blank")
    @Column(name = "root_cause", nullable = false, columnDefinition = "TEXT")
    private String rootCause;

    @NotBlank(message = "Severity cannot be blank")
    @Column(nullable = false)
    private String severity;

    @Column(name = "confidence_score")
    private Double confidence;

    @NotBlank(message = "Summary cannot be blank")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deployment_id", nullable = false, unique = true)
    private Deployment deployment;
}