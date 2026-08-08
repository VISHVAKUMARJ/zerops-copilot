package com.zeropscopilot.service;

import com.zeropscopilot.dto.request.CreateAiAnalysisRequest;
import com.zeropscopilot.dto.response.AiAnalysisResponse;

import java.util.UUID;

public interface AiAnalysisService {
    AiAnalysisResponse createAnalysis(CreateAiAnalysisRequest request);
    AiAnalysisResponse getAnalysisByDeploymentId(UUID deploymentId);
}
