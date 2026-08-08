package com.zeropscopilot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateDeploymentLogRequest(
    @NotNull(message = "Stage ID is required")
    UUID stageId,
    
    @NotBlank(message = "Log message is required")
    String message,
    
    @NotBlank(message = "Log level is required")
    String level
) {}
