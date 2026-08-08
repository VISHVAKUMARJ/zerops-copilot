package com.zeropscopilot.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record DeploymentResponse(
    UUID id,
    UUID projectId,
    String commitHash,
    String branchName,
    String status,
    List<DeploymentStageResponse> stages,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
