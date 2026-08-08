package com.zeropscopilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deployments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deployment extends BaseEntity {

    public enum DeploymentStatus {
        PENDING, IN_PROGRESS, SUCCESS, FAILED, CANCELLED
    }

    @NotBlank(message = "Commit hash cannot be blank")
    @Column(name = "commit_hash", nullable = false)
    private String commitHash;

    @NotBlank(message = "Branch name cannot be blank")
    @Column(name = "branch_name", nullable = false)
    private String branchName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DeploymentStatus status = DeploymentStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private RepositoryProject project;

    @OneToMany(mappedBy = "deployment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<DeploymentStage> stages = new ArrayList<>();

    @OneToOne(mappedBy = "deployment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private AiAnalysis aiAnalysis;
}
