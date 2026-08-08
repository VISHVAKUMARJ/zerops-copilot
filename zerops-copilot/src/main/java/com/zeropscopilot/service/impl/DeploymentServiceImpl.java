package com.zeropscopilot.service.impl;

import com.zeropscopilot.dto.request.CreateDeploymentRequest;
import com.zeropscopilot.dto.response.DeploymentResponse;
import com.zeropscopilot.entity.Deployment;
import com.zeropscopilot.entity.RepositoryProject;
import com.zeropscopilot.mapper.DeploymentMapper;
import com.zeropscopilot.repository.DeploymentRepository;
import com.zeropscopilot.repository.ProjectRepository;
import com.zeropscopilot.service.DeploymentService;
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
public class DeploymentServiceImpl implements DeploymentService {

    private final DeploymentRepository deploymentRepository;
    private final ProjectRepository projectRepository;
    private final DeploymentMapper deploymentMapper;

    @Override
    @Transactional
    public DeploymentResponse createDeployment(CreateDeploymentRequest request) {
        log.info("Creating deployment for project ID: {}", request.projectId());
        RepositoryProject project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        
        Deployment deployment = deploymentMapper.toEntity(request);
        deployment.setProject(project);
        
        Deployment savedDeployment = deploymentRepository.save(deployment);
        log.info("Deployment created with ID: {}", savedDeployment.getId());
        
        return deploymentMapper.toResponse(savedDeployment);
    }

    @Override
    @Transactional(readOnly = true)
    public DeploymentResponse getDeploymentById(UUID id) {
        Deployment deployment = deploymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Deployment not found"));
        return deploymentMapper.toResponse(deployment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeploymentResponse> getDeploymentsByProjectId(UUID projectId) {
        log.debug("Fetching deployments for project: {}", projectId);
        return deploymentRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(deploymentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateDeploymentStatus(UUID id, String status) {
        log.info("Updating deployment {} status to {}", id, status);
        Deployment deployment = deploymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Deployment not found"));
        
        try {
            deployment.setStatus(Deployment.DeploymentStatus.valueOf(status.toUpperCase()));
            deploymentRepository.save(deployment);
        } catch (IllegalArgumentException e) {
            log.error("Invalid status value: {}", status);
            throw new IllegalArgumentException("Invalid status provided");
        }
    }
}
