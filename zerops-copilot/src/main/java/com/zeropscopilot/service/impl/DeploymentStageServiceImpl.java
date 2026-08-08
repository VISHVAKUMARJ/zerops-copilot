package com.zeropscopilot.service.impl;

import com.zeropscopilot.dto.request.CreateDeploymentStageRequest;
import com.zeropscopilot.dto.request.UpdateDeploymentStageStatusRequest;
import com.zeropscopilot.dto.response.DeploymentStageResponse;
import com.zeropscopilot.entity.Deployment;
import com.zeropscopilot.entity.DeploymentStage;
import com.zeropscopilot.repository.DeploymentRepository;
import com.zeropscopilot.repository.DeploymentStageRepository;
import com.zeropscopilot.service.DeploymentStageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeploymentStageServiceImpl
        implements DeploymentStageService {

    private final DeploymentStageRepository deploymentStageRepository;
    private final DeploymentRepository deploymentRepository;

    @Override
    @Transactional
    public DeploymentStageResponse createStage(
            CreateDeploymentStageRequest request) {

        log.info(
                "Creating deployment stage for deployment: {}",
                request.deploymentId());

        Deployment deployment = deploymentRepository
                .findById(request.deploymentId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Deployment not found: "
                                + request.deploymentId()));

        DeploymentStage stage = DeploymentStage.builder()
                .name(request.name())
                .status(DeploymentStage.StageStatus.PENDING)
                .deployment(deployment)
                .build();

        DeploymentStage savedStage = deploymentStageRepository.save(stage);

        log.info(
                "Deployment stage created successfully: {}",
                savedStage.getId());

        return mapToResponse(savedStage);
    }

    @Override
    @Transactional(readOnly = true)
    public DeploymentStageResponse getStageById(
            UUID stageId) {

        log.info(
                "Fetching deployment stage: {}",
                stageId);

        DeploymentStage stage = deploymentStageRepository.findById(stageId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Deployment stage not found: "
                                + stageId));

        return mapToResponse(stage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeploymentStageResponse> getStagesByDeploymentId(
            UUID deploymentId) {

        log.info(
                "Fetching stages for deployment: {}",
                deploymentId);

        if (!deploymentRepository.existsById(deploymentId)) {
            throw new EntityNotFoundException(
                    "Deployment not found: " + deploymentId);
        }

        return deploymentStageRepository
                .findByDeploymentIdOrderByCreatedAtAsc(deploymentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public DeploymentStageResponse updateStageStatus(
            UUID stageId,
            UpdateDeploymentStageStatusRequest request) {

        log.info(
                "Updating stage {} status to {}",
                stageId,
                request.status());

        DeploymentStage stage = deploymentStageRepository.findById(stageId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Deployment stage not found: "
                                + stageId));

        DeploymentStage.StageStatus newStatus = request.status();

        stage.setStatus(newStatus);

        LocalDateTime now = LocalDateTime.now();

        if (newStatus == DeploymentStage.StageStatus.RUNNING
                && stage.getStartedAt() == null) {

            stage.setStartedAt(now);
        }

        if (newStatus == DeploymentStage.StageStatus.SUCCESS
                || newStatus == DeploymentStage.StageStatus.FAILED
                || newStatus == DeploymentStage.StageStatus.SKIPPED) {

            stage.setFinishedAt(now);
        }

        DeploymentStage updatedStage = deploymentStageRepository.save(stage);

        return mapToResponse(updatedStage);
    }

    private DeploymentStageResponse mapToResponse(
            DeploymentStage stage) {

        return new DeploymentStageResponse(
                stage.getId(),
                stage.getDeployment().getId(),
                stage.getName(),
                stage.getStatus().name(),
                stage.getStartedAt(),
                stage.getFinishedAt(),
                stage.getCreatedAt(),
                stage.getUpdatedAt());
    }
}