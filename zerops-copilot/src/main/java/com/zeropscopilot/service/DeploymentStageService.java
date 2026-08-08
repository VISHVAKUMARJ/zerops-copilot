package com.zeropscopilot.service;

import com.zeropscopilot.dto.request.CreateDeploymentStageRequest;
import com.zeropscopilot.dto.request.UpdateDeploymentStageStatusRequest;
import com.zeropscopilot.dto.response.DeploymentStageResponse;

import java.util.List;
import java.util.UUID;

public interface DeploymentStageService {

    DeploymentStageResponse createStage(
            CreateDeploymentStageRequest request);

    DeploymentStageResponse getStageById(
            UUID stageId);

    List<DeploymentStageResponse> getStagesByDeploymentId(
            UUID deploymentId);

    DeploymentStageResponse updateStageStatus(
            UUID stageId,
            UpdateDeploymentStageStatusRequest request);
}