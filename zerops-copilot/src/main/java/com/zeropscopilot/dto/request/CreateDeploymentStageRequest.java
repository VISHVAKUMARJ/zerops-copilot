package com.zeropscopilot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateDeploymentStageRequest(

        @NotNull(message = "Deployment ID is required") UUID deploymentId,

        @NotBlank(message = "Stage name is required") String name

) {
}