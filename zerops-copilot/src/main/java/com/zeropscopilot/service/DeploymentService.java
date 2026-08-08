package com.zeropscopilot.service;

import com.zeropscopilot.dto.request.CreateDeploymentRequest;
import com.zeropscopilot.dto.response.DeploymentResponse;

import java.util.List;
import java.util.UUID;

public interface DeploymentService {
    DeploymentResponse createDeployment(CreateDeploymentRequest request);
    DeploymentResponse getDeploymentById(UUID id);
    List<DeploymentResponse> getDeploymentsByProjectId(UUID projectId);
    void updateDeploymentStatus(UUID id, String status);
}
