package com.zeropscopilot.service;

import com.zeropscopilot.dto.request.CreateProjectRequest;
import com.zeropscopilot.dto.response.ProjectResponse;

import java.util.List;
import java.util.UUID;

public interface ProjectService {
    ProjectResponse createProject(CreateProjectRequest request);
    ProjectResponse getProjectById(UUID id);
    List<ProjectResponse> getAllProjects();
    void deleteProject(UUID id);
}
