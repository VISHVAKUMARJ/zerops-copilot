package com.zeropscopilot.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record DeploymentStageResponse(
    UUID id,
    String name,
    String status,
    LocalDateTime startedAt,
    LocalDateTime finishedAt
) {}
