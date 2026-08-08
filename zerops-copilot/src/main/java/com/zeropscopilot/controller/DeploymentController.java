package com.zeropscopilot.controller;

import com.zeropscopilot.dto.request.CreateDeploymentRequest;
import com.zeropscopilot.dto.response.DeploymentResponse;
import com.zeropscopilot.service.DeploymentService;
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
@RequestMapping("/api/v1/deployments")
@RequiredArgsConstructor
@Tag(name = "Deployments", description = "Endpoints for managing deployments")
public class DeploymentController {

    private final DeploymentService deploymentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new deployment", description = "Triggers a new deployment for a specific project.")
    public ResponseEntity<DeploymentResponse> createDeployment(@Valid @RequestBody CreateDeploymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deploymentService.createDeployment(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get deployment by ID", description = "Retrieves a deployment by its UUID.")
    public ResponseEntity<DeploymentResponse> getDeploymentById(@PathVariable UUID id) {
        return ResponseEntity.ok(deploymentService.getDeploymentById(id));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get deployments by Project ID", description = "Retrieves all deployments for a specific project.")
    public ResponseEntity<List<DeploymentResponse>> getDeploymentsByProjectId(@PathVariable UUID projectId) {
        return ResponseEntity.ok(deploymentService.getDeploymentsByProjectId(projectId));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update deployment status", description = "Updates the status of a specific deployment.")
    public ResponseEntity<Void> updateDeploymentStatus(@PathVariable UUID id, @RequestParam String status) {
        deploymentService.updateDeploymentStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
