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

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DeploymentServiceImpl
        implements DeploymentService {

    private final DeploymentRepository deploymentRepository;
    private final ProjectRepository projectRepository;
    private final DeploymentMapper deploymentMapper;

    /*
     * Zerops REST API client.
     */
    private final RestClient zeropsRestClient;

    /*
     * =========================================================
     * Constructor
     * =========================================================
     *
     * We keep Lombok @RequiredArgsConstructor for the normal
     * Spring dependencies and create the RestClient through
     * this constructor.
     */
    @Autowired
    public DeploymentServiceImpl(
            DeploymentRepository deploymentRepository,
            ProjectRepository projectRepository,
            DeploymentMapper deploymentMapper,
            @Value("${zerops.api.base-url}")
            String zeropsBaseUrl,

            @Value("${zerops.api.token}")
            String zeropsToken
    ) {

        this.deploymentRepository =
                deploymentRepository;

        this.projectRepository =
                projectRepository;

        this.deploymentMapper =
                deploymentMapper;

        /*
         * Create RestClient for Zerops.
         */
        this.zeropsRestClient =
                RestClient.builder()
                        .baseUrl(zeropsBaseUrl)
                        .defaultHeader(
                                HttpHeaders.AUTHORIZATION,
                                "Bearer " + zeropsToken
                        )
                        .defaultHeader(
                                HttpHeaders.ACCEPT,
                                MediaType.APPLICATION_JSON_VALUE
                        )
                        .build();
    }

    /*
     * =========================================================
     * Existing PostgreSQL functionality
     * =========================================================
     */

    @Override
    @Transactional
    public DeploymentResponse createDeployment(
            CreateDeploymentRequest request
    ) {

        log.info(
                "Creating deployment for project ID: {}",
                request.projectId()
        );

        RepositoryProject project =
                projectRepository
                        .findById(request.projectId())
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Project not found"
                                        )
                        );

        Deployment deployment =
                deploymentMapper.toEntity(
                        request
                );

        deployment.setProject(project);

        Deployment savedDeployment =
                deploymentRepository.save(
                        deployment
                );

        log.info(
                "Deployment created with ID: {}",
                savedDeployment.getId()
        );

        return deploymentMapper.toResponse(
                savedDeployment
        );
    }

    @Override
    @Transactional(readOnly = true)
    public DeploymentResponse getDeploymentById(
            UUID id
    ) {

        Deployment deployment =
                deploymentRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Deployment not found"
                                        )
                        );

        return deploymentMapper.toResponse(
                deployment
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeploymentResponse>
    getDeploymentsByProjectId(
            UUID projectId
    ) {

        log.debug(
                "Fetching deployments for project: {}",
                projectId
        );

        return deploymentRepository
                .findByProjectIdOrderByCreatedAtDesc(
                        projectId
                )
                .stream()
                .map(
                        deploymentMapper::toResponse
                )
                .collect(
                        Collectors.toList()
                );
    }

    @Override
    @Transactional
    public void updateDeploymentStatus(
            UUID id,
            String status
    ) {

        log.info(
                "Updating deployment {} status to {}",
                id,
                status
        );

        Deployment deployment =
                deploymentRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Deployment not found"
                                        )
                        );

        try {

            deployment.setStatus(
                    Deployment.DeploymentStatus
                            .valueOf(
                                    status.toUpperCase()
                            )
            );

            deploymentRepository.save(
                    deployment
            );

        } catch (
                IllegalArgumentException e
        ) {

            log.error(
                    "Invalid status value: {}",
                    status
            );

            throw new IllegalArgumentException(
                    "Invalid status provided"
            );
        }
    }

    /*
     * =========================================================
     * NEW - Test Zerops API connection
     * =========================================================
     *
     * This method calls the Zerops application-version
     * resource.
     *
     * We will use this as the first integration test.
     */
    public String testZeropsConnection() {

        log.info(
                "Calling Zerops REST API..."
        );

        try {

            String response = zeropsRestClient
                .get()
                .uri("/project")
                .retrieve()
                .body(String.class);

            log.info(
                    "Zerops API response received successfully."
            );

            return response;

        } catch (Exception e) {

            log.error(
                    "Failed to call Zerops API",
                    e
            );

            throw new RuntimeException(
                    "Failed to connect to Zerops API: "
                            + e.getMessage(),
                    e
            );
        }
    }
}