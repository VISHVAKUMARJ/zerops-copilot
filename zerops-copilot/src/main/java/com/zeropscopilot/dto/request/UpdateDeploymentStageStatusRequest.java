package com.zeropscopilot.dto.request;

import com.zeropscopilot.entity.DeploymentStage;
import jakarta.validation.constraints.NotNull;

public record UpdateDeploymentStageStatusRequest(

        @NotNull(message = "Stage status is required") DeploymentStage.StageStatus status

) {
}