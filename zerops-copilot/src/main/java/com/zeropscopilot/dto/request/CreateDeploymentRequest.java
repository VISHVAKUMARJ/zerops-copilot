package com.zeropscopilot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateDeploymentRequest(
    @NotNull(message = "Project ID is required")
    UUID projectId,
    
    @NotBlank(message = "Commit hash is required")
    String commitHash,
    
    @NotBlank(message = "Branch name is required")
    String branchName
) {}
