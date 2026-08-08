package com.zeropscopilot.controller;

import com.zeropscopilot.dto.request.CreateProjectRequest;
import com.zeropscopilot.dto.response.ProjectResponse;
import com.zeropscopilot.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Endpoints for managing Zerops deployment projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new project", description = "Creates a new project with the provided details.")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieves a specific project by its UUID.")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieves a list of all projects.")
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a project", description = "Deletes a specific project by its UUID.")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
