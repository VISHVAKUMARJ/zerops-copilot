package com.zeropscopilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deployment_stages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeploymentStage extends BaseEntity {

    public enum StageStatus {
        PENDING, RUNNING, SUCCESS, FAILED, SKIPPED
    }

    @NotBlank(message = "Stage name cannot be blank")
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StageStatus status = StageStatus.PENDING;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deployment_id", nullable = false)
    private Deployment deployment;

    @OneToMany(mappedBy = "stage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<DeploymentLog> logs = new ArrayList<>();
}
