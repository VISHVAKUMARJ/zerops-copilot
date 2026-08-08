package com.zeropscopilot.service.impl;

import com.zeropscopilot.dto.request.CreateAiAnalysisRequest;
import com.zeropscopilot.dto.response.AiAnalysisResponse;
import com.zeropscopilot.entity.AiAnalysis;
import com.zeropscopilot.entity.Deployment;
import com.zeropscopilot.mapper.AiAnalysisMapper;
import com.zeropscopilot.repository.AiAnalysisRepository;
import com.zeropscopilot.repository.DeploymentRepository;
import com.zeropscopilot.service.AiAnalysisService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalysisServiceImpl implements AiAnalysisService {

    private final AiAnalysisRepository aiAnalysisRepository;
    private final DeploymentRepository deploymentRepository;
    private final AiAnalysisMapper aiAnalysisMapper;

    @Override
    @Transactional
    public AiAnalysisResponse createAnalysis(CreateAiAnalysisRequest request) {
        log.info("Creating AI Analysis for deployment: {}", request.deploymentId());
        
        if (aiAnalysisRepository.findByDeploymentId(request.deploymentId()).isPresent()) {
            throw new IllegalArgumentException("AI Analysis already exists for this deployment");
        }
        
        Deployment deployment = deploymentRepository.findById(request.deploymentId())
                .orElseThrow(() -> new EntityNotFoundException("Deployment not found"));
                
        AiAnalysis analysis = aiAnalysisMapper.toEntity(request);
        analysis.setDeployment(deployment);
        
        AiAnalysis savedAnalysis = aiAnalysisRepository.save(analysis);
        log.info("AI Analysis created with ID: {}", savedAnalysis.getId());
        
        return aiAnalysisMapper.toResponse(savedAnalysis);
    }

    @Override
    @Transactional(readOnly = true)
    public AiAnalysisResponse getAnalysisByDeploymentId(UUID deploymentId) {
        log.debug("Fetching AI Analysis for deployment: {}", deploymentId);
        AiAnalysis analysis = aiAnalysisRepository.findByDeploymentId(deploymentId)
                .orElseThrow(() -> new EntityNotFoundException("AI Analysis not found for deployment"));
        return aiAnalysisMapper.toResponse(analysis);
    }
}
