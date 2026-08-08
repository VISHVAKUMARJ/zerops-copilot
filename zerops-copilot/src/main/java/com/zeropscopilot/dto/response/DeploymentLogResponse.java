package com.zeropscopilot.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record DeploymentLogResponse(
    UUID id,
    UUID stageId,
    String message,
    String level,
    LocalDateTime timestamp
) {}
