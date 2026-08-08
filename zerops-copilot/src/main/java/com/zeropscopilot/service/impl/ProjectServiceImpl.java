package com.zeropscopilot.service.impl;

import com.zeropscopilot.dto.request.CreateProjectRequest;
import com.zeropscopilot.dto.response.ProjectResponse;
import com.zeropscopilot.entity.RepositoryProject;
import com.zeropscopilot.mapper.ProjectMapper;
import com.zeropscopilot.repository.ProjectRepository;
import com.zeropscopilot.service.ProjectService;
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
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    @Override
    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        log.info("Creating new project with name: {}", request.name());
        if (projectRepository.existsByName(request.name())) {
            log.error("Project with name {} already exists", request.name());
            throw new IllegalArgumentException("Project name already exists");
        }
        
        RepositoryProject project = projectMapper.toEntity(request);
        RepositoryProject savedProject = projectRepository.save(project);
        log.info("Project created successfully with ID: {}", savedProject.getId());
        
        return projectMapper.toResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(UUID id) {
        log.debug("Fetching project by ID: {}", id);
        RepositoryProject project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with ID: " + id));
        return projectMapper.toResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        log.debug("Fetching all projects");
        return projectRepository.findAll().stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteProject(UUID id) {
        log.info("Deleting project with ID: {}", id);
        if (!projectRepository.existsById(id)) {
            throw new EntityNotFoundException("Project not found with ID: " + id);
        }
        projectRepository.deleteById(id);
        log.info("Project deleted successfully");
    }
}
