package com.zeropscopilot.service.impl;

import com.zeropscopilot.client.AiClient;
import com.zeropscopilot.dto.request.AiServiceRequest;
import com.zeropscopilot.dto.response.AiAnalysisResponse;
import com.zeropscopilot.dto.response.AiServiceResponse;
import com.zeropscopilot.entity.AiAnalysis;
import com.zeropscopilot.entity.Deployment;
import com.zeropscopilot.entity.DeploymentLog;
import com.zeropscopilot.repository.AiAnalysisRepository;
import com.zeropscopilot.repository.DeploymentLogRepository;
import com.zeropscopilot.repository.DeploymentRepository;
import com.zeropscopilot.service.AiService;
import com.zeropscopilot.service.DeploymentAnalysisService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeploymentAnalysisServiceImpl implements DeploymentAnalysisService {

        private final DeploymentRepository deploymentRepository;
        private final DeploymentLogRepository deploymentLogRepository;
        private final AiAnalysisRepository aiAnalysisRepository;
        private final AiService aiService;

        @Override
        @Transactional
        public AiAnalysisResponse analyzeAndSave(AiServiceRequest request) {

                log.info(
                                "Starting deployment analysis for deployment: {}",
                                request.deploymentId());

                // 1. Find the deployment
                UUID deploymentId = UUID.fromString(request.deploymentId());

                Deployment deployment = deploymentRepository.findById(deploymentId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Deployment not found: " + request.deploymentId()));

                // 2. Fetch all logs belonging to this deployment
                List<DeploymentLog> deploymentLogs = deploymentLogRepository
                                .findByStage_Deployment_IdOrderByTimestampAsc(
                                                deploymentId);

                if (deploymentLogs.isEmpty()) {
                        throw new EntityNotFoundException(
                                        "No deployment logs found for deployment: "
                                                        + deploymentId);
                }

                log.info(
                                "Found {} logs for deployment: {}",
                                deploymentLogs.size(),
                                deploymentId);

                // 3. Combine all log messages into one string
                String logs = deploymentLogs.stream()
                                .map(DeploymentLog::getMessage)
                                .collect(Collectors.joining("\n"));

                // 4. Create request for AI service
                AiServiceRequest aiRequest = new AiServiceRequest(
                                request.deploymentId(),
                                logs);

                // 5. Send logs to AI service
                AiServiceResponse aiResponse = aiService.analyzeDeployment(aiRequest);

                // 6. Create AiAnalysis entity
                AiAnalysis aiAnalysis = AiAnalysis.builder()
                                .rootCause(aiResponse.rootCause())
                                .severity(aiResponse.severity())
                                .confidence(aiResponse.confidence())
                                .summary(aiResponse.summary())
                                .recommendations(
                                                aiResponse.recommendations() == null
                                                                ? ""
                                                                : aiResponse.recommendations()
                                                                                .stream()
                                                                                .collect(Collectors.joining("\n")))
                                .deployment(deployment)
                                .build();

                // 7. Save AI analysis
                AiAnalysis savedAnalysis = aiAnalysisRepository.save(aiAnalysis);

                log.info(
                                "AI Analysis saved successfully with id {}",
                                savedAnalysis.getId());

                // 8. Return response
                return new AiAnalysisResponse(
                                savedAnalysis.getId(),
                                deployment.getId(),
                                savedAnalysis.getSummary(),
                                savedAnalysis.getRecommendations(),
                                savedAnalysis.getConfidence(),
                                savedAnalysis.getCreatedAt());
        }

        @Override
        @Transactional(readOnly = true)
        public AiAnalysisResponse getAnalysisByDeploymentId(
                        UUID deploymentId) {

                log.info(
                                "Fetching AI analysis for deployment: {}",
                                deploymentId);

                AiAnalysis analysis = aiAnalysisRepository
                                .findByDeploymentId(deploymentId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "AI analysis not found for deployment: "
                                                                + deploymentId));

                return new AiAnalysisResponse(
                                analysis.getId(),
                                analysis.getDeployment().getId(),
                                analysis.getSummary(),
                                analysis.getRecommendations(),
                                analysis.getConfidence(),
                                analysis.getCreatedAt());
        }
}