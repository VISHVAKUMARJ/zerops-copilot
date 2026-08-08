package com.zeropscopilot.service;

import com.zeropscopilot.dto.request.AiServiceRequest;
import com.zeropscopilot.dto.response.AiAnalysisResponse;

import java.util.UUID;

public interface DeploymentAnalysisService {

    AiAnalysisResponse analyzeAndSave(AiServiceRequest request);

    AiAnalysisResponse getAnalysisByDeploymentId(UUID deploymentId);
}