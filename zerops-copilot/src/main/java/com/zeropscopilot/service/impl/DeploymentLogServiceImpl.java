package com.zeropscopilot.service.impl;

import com.zeropscopilot.dto.request.CreateDeploymentLogRequest;
import com.zeropscopilot.dto.response.DeploymentLogResponse;
import com.zeropscopilot.entity.DeploymentLog;
import com.zeropscopilot.entity.DeploymentStage;
import com.zeropscopilot.mapper.DeploymentLogMapper;
import com.zeropscopilot.repository.DeploymentLogRepository;
import com.zeropscopilot.repository.DeploymentStageRepository;
import com.zeropscopilot.service.DeploymentLogService;
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
public class DeploymentLogServiceImpl implements DeploymentLogService {

    private final DeploymentLogRepository logRepository;
    private final DeploymentStageRepository stageRepository;
    private final DeploymentLogMapper logMapper;

    @Override
    @Transactional
    public DeploymentLogResponse addLog(CreateDeploymentLogRequest request) {
        log.debug("Adding log to stage ID: {}", request.stageId());
        DeploymentStage stage = stageRepository.findById(request.stageId())
                .orElseThrow(() -> new EntityNotFoundException("Stage not found"));
                
        DeploymentLog deploymentLog = logMapper.toEntity(request);
        deploymentLog.setStage(stage);
        
        try {
            deploymentLog.setLevel(DeploymentLog.LogLevel.valueOf(request.level().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid log level");
        }
        
        DeploymentLog savedLog = logRepository.save(deploymentLog);
        return logMapper.toResponse(savedLog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeploymentLogResponse> getLogsByStageId(UUID stageId) {
        return logRepository.findByStageIdOrderByTimestampAsc(stageId).stream()
                .map(logMapper::toResponse)
                .collect(Collectors.toList());
    }
}
