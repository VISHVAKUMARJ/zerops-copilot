package com.zeropscopilot.service;

import com.zeropscopilot.dto.request.CreateDeploymentLogRequest;
import com.zeropscopilot.dto.response.DeploymentLogResponse;

import java.util.List;
import java.util.UUID;

public interface DeploymentLogService {
    DeploymentLogResponse addLog(CreateDeploymentLogRequest request);
    List<DeploymentLogResponse> getLogsByStageId(UUID stageId);
}
